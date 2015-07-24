var exec = require("child_process").exec;
var express = require('express');
var randomstring = require('randomstring');
var Timeline = require('pebble-api');
var mongo = require('mongojs');

var database = mongo('tv', ['base']);

database.base.aggregate({$unwind : "$channel"},     {$match : { } },    {$group : { "_id" : "$_id" , "channel" : { $push: "$channel" } } }, function(something, docs){
    if(docs == ""){
        console.error("wtf");
    }
    else{
        var channels = docs[0].channel;
        for(var i = 0; i < channels.length; i++){
            var channel_id = channels[i].attributes.id;
            var channel_name  = channels[i].display_name[2];
            console.log("case \"" + channel_id + "\":\n    return \"" + channel_name + "\";");
        }
    }
});
