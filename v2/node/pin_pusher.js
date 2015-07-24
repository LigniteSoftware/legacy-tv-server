var express = require('express');
//var randomstring = require('randomstring');
var Timeline = require('pebble-api');
var mongo = require('mongojs');

var timeline = new Timeline({
  apiKey: 'azhvjum2kg0sj0grai7dov7ixoyg4ov7'
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

var database = mongo('tv', ['base', 'user_shows']);
var shows;
var currentShow = 0, startTime = 0;

function run(){
    currentShow = 0;
    shows = null;
    database.base.aggregate({$unwind : "$programme"},     {$match : {  } },    {$group : { "_id" : "$_id" , "programme" : { $push: "$programme" } } }, function(something, docs){
        shows = docs[0].programme;
        console.log("Amount of shows: " + shows.length);
        pushNextShow();
    });
}

function pushNextShow(){
    var d = new Date();
    startTime = d.getTime();
    if(currentShow < shows.length){
        var lockedShow = currentShow;
        database.user_shows.find({ show:shows[lockedShow].title }, function(error, adocs){
            if(adocs[0]){
                for(var i = 0; i < adocs.length; i++){
                    var channel = adocs[i].channelName;
                    console.log("Pushing " + shows[lockedShow].title + " (channel: " + channel + ")");
                    pushShow(shows[lockedShow], channel);
                }
            }
            else{
                pushNextShow();
            }
        });
    }
    currentShow++;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function pushShow(currentShow, channel){
  var id = constructIDFromShow(currentShow);
  var start = getStartFromShow(currentShow);
  var duration = constructLengthFromShow(currentShow);
  var type = "calendarPin";
  var icon = "system://images/TV_SHOW";
  var title = currentShow.title;

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
  console.log("Sending " + JSON.stringify(jsonPin));
  var pin = new Timeline.Pin(jsonPin);

  var fixtitle = title;
  fixtitle = replaceAll(" ", "", fixtitle);
  fixtitle += "__" + channel;
  console.log(fixtitle);
  var topic = [fixtitle];
  timeline.sendSharedPin(topic, pin, function (err, body, resp) {
    if (err) {
        pushNextShow();
        console.log(body);
        return console.error(err);
    }
    var d = new Date();
    var endTime = d.getTime();
    console.log("(Success!) Completed in " + (endTime-startTime) + " milliseconds.");
    pushNextShow();
  });
}

run();

setInterval(function(){
    console.log("Autorunning.");
    run();
}, 2 * 60 * 1000);
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
