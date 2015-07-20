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
        fs.readFile('/var/www/tv.edwinfinch.com/data_creator/data.json', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            console.log("got data");
            var allText = data;
            done = true;

            var rstring = replaceAll("display-name", "display_name", replaceAll(".labs.zap2it.com", "", replaceAll("@attributes", "attributes", replaceAll('"previously-shown":{}', '"new":false', replaceAll('"new":{}', '"new":true', allText)))));
            var objects = getValues(JSON.parse(rstring), "new");
            var pcount = 0, ncount = 0;
            for(var i = 0; i < objects.length; i++){ if(objects[i]){ pcount++; }else{ ncount++; } }
            console.log("\nCount of: " + pcount + " ncount of " +  ncount);

            var database = mongo('tv', ['base']);

            database.base.remove({});
            console.log("parsed");
            database.base.insert(JSON.parse(rstring));

            database.base.find({}, function(something, docs){
                if(docs == ""){
                    console.log("not ok");
                    res.writeHead(404);
                    res.end('{ "error":"not found" }');
                    console.log("hello crash");
                    console.log(hello);
                }
                else{
                    res.writeHead(200);
                    res.end(JSON.stringify(docs[0]));
                }
            });
        });
    }
    readTextFile("");
