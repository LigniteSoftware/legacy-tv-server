var http = require('http');
var qs = require('querystring');
var mongo = require('mongojs');
var express = require('express');

var app = express();
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://tv.edwinfinch.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/', function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
        if(data == ""){
            res.writeHead(400);
            res.end(' { "error":"bad request", "localized_description":"no data in POST request" }');
        }
        else{
            var post = qs.parse(data);
            var database = mongo('tv', ['base']);

            if(!post.is_channel_search){
                console.log("Is an actual search. Type: " + post.request_type + " name: " + post.request_name);

                var request_type = post.request_type;
                var arg1 = {$match : { "what" : post.request_name } };
                switch(post.request_type){
                    case "channel":
                        arg1 = {$match : { "programme.attributes.channel" : post.request_name } };
                        break;
                    case "show":
                    default:
                        arg1 = {$match : { "programme.title" : post.request_name } };
                        break;
                }

                if(post.request_type != "all_channels"){
                    database.base.aggregate( {$unwind : "$programme"},     arg1,    {$group : { "_id" : "$_id" , "programme" : { $push: "$programme" } } }, function(something, docs){
                        if(docs == ""){
                            res.writeHead(404);
                            res.end('{ "error":"not found", "type":"' + post.request_type + '", "name":"' + post.request_name + '" }');
                        }
                        else{
                            res.writeHead(200);
                            res.end(JSON.stringify(docs[0]));
                        }
                    });
                }
                else{ 
                    database.base.aggregate({$unwind : "$channel"},     {$match : { } },    {$group : { "_id" : "$_id" , "channel" : { $push: "$channel" } } }, function(something, docs){
                        if(docs == ""){
                            res.writeHead(404);
                            res.end('{ "error":"not found", "type":"all_channels" }');
                        }
                        else{
                            res.writeHead(200);
                            res.end(JSON.stringify(docs[0]));
                        }
                    });
                }
            }
            else{
                console.log("Searching for channels...");
                database.base.aggregate(  {$unwind : "$channel"},     {$match : { } },    {$group : { "_id" : "$_id" , "channel" : { $push: "$channel" } } }, function(something, docs){
                    res.writeHead(200);
                    res.end(JSON.stringify(docs[0]));
                });
            }
        }
    })
});

app.post('/mobile_search', function (req, res) {
    console.log("Mobile search");
    res.writeHead(200);
    res.end("hello");
});

var port = 52382;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Search app listening at http://%s:%s :)', host, port);
});
