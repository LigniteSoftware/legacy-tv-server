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

var showLocation = "NBC";
var showTitle = "Chuck: S02E01";
var edgyTopics = ["chuck"];

function constructIDFromShow(show){
    var id = "";
    id += show.attributes.channel;
    id += show.attributes.start.substring(3, 9);
    id += show.title;
    return id;
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

database.base.aggregate( {$unwind : "$programme"},     {$match : { "programme.title" : "News" } },    {$group : { "_id" : "$_id" , "programme" : { $push: "$programme" } } }, function(something, docs){
    var show = docs[0].programme[0];
    console.log("show: " + JSON.stringify(show));
    console.log(constructIDFromShow(show));
    console.log(constructLengthFromShow(show))
});

/*
// handler for GET /senduserpin/:userToken/:minutesToAdd?
app.get('/senduserpin/', function (req, res) {
  // create the pin object
  var pin = new Timeline.Pin({
    id: constructIDFromShow(currentShow),
    time: getStartFromShow(currentShow),
    duration: constructLengthFromShow(currentShow),
    layout: {
      type: "calendarPin",
      tinyIcon: "system://images/TV_SHOW",
      largeIcon: "system://images/TV_SHOW",
      locationName: currentShow.attributes.channel,
      title: currentShow.title
    }
  });

  // add actions to the pin

    pin.addAction(new Timeline.Pin.Action({
      type: Timeline.Pin.ActionType.OPEN_WATCH_APP,
      title: "Stop this show",
      launchCode: 400
    }));

  // send the pin
  timeline.sendSharedPin(edgyTopics, pin, function (err, body, resp) {
    if (err) {
      return console.error(err);
    }

    res.send('Status code: ' + resp.statusCode);
  });
});

// start the webserver
var server = app.listen(app.get('port'), function () {
  console.log('timeline-user example app listening on port %s', app.get('port'));
});
*/
