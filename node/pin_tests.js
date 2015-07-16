var express = require('express');
var randomstring = require('randomstring');
var Timeline = require('pebble-api');

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

// handler for GET /senduserpin/:userToken/:minutesToAdd?
app.get('/senduserpin/:userToken/:minutesToAdd?', function (req, res) {

  var userToken = req.params.userToken;
  var minutesToAdd = req.params.minutesToAdd || 0;

  console.log('Got a request from ' + userToken + ' to send in a pin in ' + minutesToAdd + ' min');

  // generate a random id
  var id = randomstring.generate(8);

  var now = new Date();

  // create the pin object
  var pin = new Timeline.Pin({
    id: id,
    time: new Date(now.getTime() + (minutesToAdd * 60 * 1000)),
    duration: 60,
    layout: {
      type: "calendarPin",
      tinyIcon: "system://images/TV_SHOW",
      largeIcon: "system://images/TV_SHOW",
      locationName: showLocation,
      title: showTitle,
      body: 'Airing soon, make sure to catch the show or record it!'
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
