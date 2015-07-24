var http = require('http');
var express = require('express');
var randomstring = require('randomstring');
var Timeline = require('pebble-api');
var mongo = require('mongojs');
var fs = require('fs');

    var done = false;
    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && obj[i] == val || i == key && val == '') { //
                objects.push(obj);
            } else if (obj[i] == val && key == ''){
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1){
                    objects.push(obj);
                }
            }
        }
        return objects;
    }

    //return an array of values that match on a certain key
    function getValues(obj, key) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getValues(obj[i], key));
            } else if (i == key) {
                objects.push(obj[i]);
            }
        }
        return objects;
    }

    //return an array of keys that match on a certain value
    function getKeys(obj, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getKeys(obj[i], val));
            } else if (obj[i] == val) {
                objects.push(i);
            }
        }
        return objects;
    }

    function replaceAll(find, replace, str) {
      return str.replace(new RegExp(find, 'g'), replace);
    }


    function readTextFile(file){
    if(done){ return; }
        var allText;
        fs.readFile('data.json', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            console.log("Got data.");
            var allText = data;
            done = true;

            var rstring = replaceAll("'", "", replaceAll("episode-name", "episode_name", replaceAll("display-name", "display_name", replaceAll(".labs.zap2it.com", "", replaceAll("@attributes", "attributes", replaceAll('"previously-shown":{}', '"new":false', replaceAll('"new":{}', '"new":true', allText)))))));
            var objects = getValues(JSON.parse(rstring), "new");

            var database = mongo('tv', ['base']);

            database.base.remove({}, function(error, whatever){ if(error) { console.log(error) } });
            console.log("Removed old entries. Now inserting new data.");
            database.base.insert(JSON.parse(rstring), function(error){ 
                if(error){ 
                    console.log(error) 
                }
                console.log("Finding entries.");
                database.base.find({}, function(something, docs){
                    if(something){
                        console.log("Error: " + something);
                    }
                    else{
                        console.log("Success.");
                    }
                    console.log("Aloha snackbar");
                    console.log(virus_dot_exe);
                });
            });
        });
    }
    readTextFile("");
