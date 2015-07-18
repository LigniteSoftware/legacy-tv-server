var express = require('express');
var randomstring = require('randomstring');
var Timeline = require('pebble-api');
var mongo = require('mongojs');

var app = express();
app.set('port', (process.env.PORT || 5000));

// handler for GET /
app.get('/', function (req, res) {
  res.send('Hello, World!');
});

var timeline = new Timeline({
  apiKey: 'SBz0h725s5b3nrumo3jf4tfez3dr7i57'
});

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function constructIDFromShow(show){
    var id = "";
    id += show.attributes.channel;
    id += show.attributes.start.substring(3, 9);
    id += show.title;
    return replaceAll(" ", "", id).toLowerCase();
}

function constructLengthFromShow(show){
    var startString = show.attributes.start, endString = show.attributes.stop;

    var newStartString = startString.substring(0, 4) + "/" + startString.substring(4, 6) + "/" + startString.substring(6, 8) + " " + startString.substring(8, 10) + ":" + startString.substring(10, 12);
    var start = new Date(newStartString);

    var newEndString = endString.substring(0, 4) + "/" + endString.substring(4, 6) + "/" + endString.substring(6, 8) + " " + endString.substring(8, 10) + ":" + endString.substring(10, 12);
    var end = new Date(newEndString);

    console.log("start: " + start + " and end: " + end);

    var msecondsDifference = end.getTime()-start.getTime();
    var duration = msecondsDifference/1000/60;

    return duration;
}

function getStartFromShow(show){
    var startString = show.attributes.start;
    var newStartString = startString.substring(0, 4) + "/" + startString.substring(4, 6) + "/" + startString.substring(6, 8) + " " + startString.substring(8, 10) + ":" + startString.substring(10, 12);
    var start = new Date(newStartString);
    return start;
}

var database = mongo('tv', ['base']);
var shows;
var currentShow = 0, startTime = 0;

database.base.aggregate({$unwind : "$programme"},     {$match : {  } },    {$group : { "_id" : "$_id" , "programme" : { $push: "$programme" } } }, function(something, docs){
    shows = docs[0].programme;
    console.log("Amount of shows: " + shows.length);
    var show = shows[0];
    console.log("show: " + JSON.stringify(show));
    console.log(constructIDFromShow(show));
    console.log(constructLengthFromShow(show));

    pushNextShow();
});

function pushNextShow(){

    var d = new Date();
    startTime = d.getTime();
    if(currentShow < 5){
        pushShow(shows[currentShow]);
    }
    currentShow++;
}

// handler for GET /senduserpin/:userToken/:minutesToAdd?
//app.get('/senduserpin/', function (req, res) {
function pushShow(currentShow){
  // create the pin object
  var id = constructIDFromShow(currentShow);
  var start = getStartFromShow(currentShow);
  var duration = constructLengthFromShow(currentShow);
  var type = "calendarPin";
  var icon = "system://images/TV_SHOW";
  var title = currentShow.title;
  var channel = currentShow.attributes.channel;

  var jsonPin = {
     id: id,
     time: start,
     duration: duration,
     layout: {
        type: type,
        tinyIcon: icon,
        largeIcon: icon,
        locationName: channel,
        title: title,
      }
  };
  var pin = new Timeline.Pin(jsonPin);

  var topic = [title];
  timeline.sendSharedPin(topic, pin, function (err, body, resp) {
    if (err) {
        pushNextShow();
        console.log(body);
        return console.error(err);
    }
    var d = new Date();
    var endTime = d.getTime();
    console.log("Completed in " + (endTime-startTime) + " milliseconds.");
    pushNextShow();
  });
}
//});
/*
 * Depreciated shit I don't want to lose
 * rip in spret wins
 *
// start the webserver
var server = app.listen(app.get('port'), function () {
  console.log('PinPusher listening on port %s', app.get('port'));
});

// add actions to the pin
  pin.addAction(new Timeline.Pin.Action({
    type: Timeline.Pin.ActionType.OPEN_WATCH_APP,
    title: "Stop this show",
    launchCode: 400
  }));
*/
