var exec = require("child_process").exec;
var express = require('express');
var randomstring = require('randomstring');
var Timeline = require('pebble-api');
var mongo = require('mongojs');

var database = mongo('tv', ['base', 'pushed_pins']);
var shows;
var currentShow = 0, startTime = 0;

function run_main(){
        console.log("=== Running! ===");
      exec("perl zap2xml2.pl -u contact@edwinfinch.com -p GetShrekscoped -d 4", function (error, stdout, stderror) {
          console.log("" + stderror);
          console.log("=== Completed!\nConverting data... ===");
          exec("php convert.php", function (error, stdout, stderror) {
              if(error){
                  console.log("Error:\n" + error);
              }
              if(stderror){
                  console.log("STD Error:\n" + stderror);
              }
              console.log("Output:\n" + stdout);

              console.log("=== Running updateDatabase.js ===");
              exec("nodejs updateDatabase.js", function (error, stdout, stderror) {
                  console.log("Database updated. Output:\n" + stdout);
                  run_pusher();
              });
          });
      });
}

run_main();

setInterval(run_main, 90 * 60 * 1000);

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

function run_pusher(){
    console.log("Running pusher");
    currentShow = 0;
    shows = null;
    database.base.aggregate({$unwind : "$programme"},     {$match : {  } },    {$group : { "_id" : "$_id" , "programme" : { $push: "$programme" } } }, function(something, docs){
        shows = docs[0].programme;
        console.log("Amount of shows: " + shows.length);
        pushNextShow();
    });
}

//I'm sorry
function channel_name_lookup(channelID){
    switch(channelID){
        case "I10003":
            return "ABC";
        case "I10098":
            return "CBS";
        case "I10991":
            return "NBC";
        case "I10212":
            return "FOX";
        case "I51306":
            return "CW";
        case "I11039":
            return "PBS";
        case "I51307":
            return "myTV";
        case "I10239":
            return "Telemundo";
        case "I29058":
            return "UniMas";
        case "I11118":
            return "Univision";
        case "I10035":
            return "A&E";
        case "I10093":
            return "ABC Family";
        case "I10021":
            return "AMC";
        case "I16331":
            return "Animal Pl";
        case "I70248":
            return "ANTENNA";
        case "I18332":
            return "BBCA";
        case "I10051":
            return "BET";
        case "I16834":
            return "FYISD";
        case "I14755":
            return "Bloomberg";
        case "I73067":
            return "Bounce";
        case "I10057":
            return "Bravo";
        case "I12131":
            return "Cartoon";
        case "I16365":
            return "CBS Sports";
        case "I10120":
            return "Cinemax";
        case "I10138":
            return "CMT";
        case "I10139":
            return "CNBC";
        case "I10142":
            return "CNN";
        case "I10149":
            return "Comedy";
        case "I48990":
            return "Create";
        case "I10161":
            return "CSPAN";
        case "I10162":
            return "CSPAN2";
        case "I16125":
            return "DLC";
        case "I11150":
            return "Discovery";
        case "I10171":
            return "Disney";
        case "I18279":
            return "Disney XD";
        case "I10989":
            return "E!";
        case "I10178":
            return "Encore";
        case "I10179":
            return "ESPN";
        case "I12444":
            return "ESPN 2";
        case "I15451":
            return "ESPN Clsc";
        case "I16485":
            return "ESPNews";
        case "I45654":
            return "ESPNU";
        case "I18511":
            return "Esquire";
        case "I12574":
            return "Food";
        case "I14988":
            return "Fox Movie";
        case "I16374":
            return "Fox News";
        case "I14321":
            return "FX";
        case "I17927":
            return "FXX";
        case "I16062":
            return "GAC";
        case "I14899":
            return "Golf";
        case "I14909":
            return "GSN";
        case "I11221":
            return "Hallmark";
        case "I10240":
            return "HBO";
        case "I10241":
            return "HBO 2";
        case "I16585":
            return "HBOFamily";
        case "I10243":
            return "HBO Sig";
        case "I14902":
            return "HGTV";
        case "I14771":
            return "History";
        case "I18822":
            return "History 2";
        case "I10145":
            return "HLN";
        case "I16618":
            return "DFC";
        case "I16615":
            return "ID";
        case "I14873":
            return "IFC";
        case "I18633":
            return "ION";
        case "I55241":
            return "ION Life";
        case "I10918":
            return "Lifetime";
        case "I70938":
            return "Live Well";
        case "I18480":
            return "LMN";
        case "I70436":
            return "Me TV";
        case "I18284":
            return "American Heroes Channel";
        case "I10121":
            return "MoreMax";
        case "I16300":
            return "MSNBC";
        case "I10986":
            return "MTV";
        case "I16361":
            return "MTV 2";
        case "I24959":
            return "NatGeo";
        case "I66804":
            return "NGeoWild";
        case "I15952":
            return "NBCSN";
        case "I34710":
            return "NFL";
        case "I11006":
            return "Nick";
        case "I19211":
            return "Nick jr";
        case "I30420":
            return "Nicktoons";
        case "I14776":
            return "Outdoor";
        case "I70387":
            return "OWN";
        case "I21484":
            return "Oxygen";
        case "I54596":
            return "Qubo";
        case "I52199":
            return "Reelz";
        case "I16616":
            return "Science";
        case "I11116":
            return "SHO 2";
        case "I18086":
            return "ShoExtreme";
        case "I16153":
            return "Showcase";
        case "I11115":
            return "Showtime";
        case "I11163":
            return "Spike";
        case "I12719":
            return "Starz";
        case "I16108":
            return "Sundance";
        case "I11097":
            return "Syfy";
        case "I14767":
            return "TBN";
        case "I11867":
            return "TBS";
        case "I12852":
            return "TCM";
        case "I59036":
            return "Teen Nick";
        case "I61775":
            return "This TV";
        case "I11158":
            return "TLC";
        case "I11160":
            return "TMC";
        case "I17663":
            return "TMC Extra";
        case "I11164":
            return "TNT";
        case "I11180":
            return "Travel";
        case "I10153":
            return "truTV";
        case "I16715":
            return "TV Guide";
        case "I16123":
            return "TV Land";
        case "I11207":
            return "USA";
        case "I11218":
            return "VH1";
        case "I22561":
            return "VH1 Clsc";
        case "I16409":
            return "WE TV";
        case "I11187":
            return "Weather";
        case "I17098":
            return "WGN Amer";
        case "I56725":
            return "World";
        case "I47176":
            return "AJAM";
        default:
            console.log("Return " + channelID + " is not found. Sorry.");
            return channelID;
    }
}

function pushNextShow(){
    var d = new Date();
    startTime = d.getTime();
    if(currentShow < shows.length){
        var lockedShow = currentShow;
        database.pushed_pins.find({ pinid:constructIDFromShow(shows[lockedShow]) }, function(error, docs){
            if(docs.length > 0){
                console.log("Already pushed + " + constructIDFromShow(shows[lockedShow]) + ", rejecting.");
                pushNextShow();
            }
            else{
                pushShow(shows[lockedShow], channel_name_lookup(shows[currentShow].attributes.channel));
                //pushNextShow();
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
  fixtitle = fixtitle.substring(0, 22);
  fixtitle += "__" + channel;
  console.log("Pushing new " + fixtitle);
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
    database.pushed_pins.insert({ pinid:id, pushTime:endTime, pushRunTime:endTime-startTime }, function(error, docs){
        if(error){
            console.error("Error pushing pin! " + error);
            return;
        }
    });
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
