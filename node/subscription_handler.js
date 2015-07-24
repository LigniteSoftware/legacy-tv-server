var http = require('http');
var express = require('express');
var randomstring = require('randomstring');
var mongo = require('mongojs');
var fs = require('fs');
var qs = require('querystring');

var app = express();

app.post('/', function (req, res) {
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
        if(data == ""){
            res.writeHead(400);
            console.log("No data in request");
            res.end(' { "error":"bad request" } ');
            return;
        }
        var post = qs.parse(data);
        var database = mongo('tv', ['users', 'user_shows']);
        var usernameSent = post.username, accessTokenSent = post.accessToken, showSent = post.show, subscribing = (post.subscribe == "true"), channelSent = post.channel;

        database.users.find({ username:usernameSent, accessToken:accessTokenSent }, function(error, docs){
            if(docs[0]){
                if(subscribing){
                    database.user_shows.insert({ username:usernameSent, accessToken:accessTokenSent, show:showSent, channelName:channelSent }, function(error, docs){
                        if(error){
                            res.writeHead(500);
                            res.end(JSON.stringify({
                                error:error,
                                message:"sorry"
                            }));
                            return;
                        }
                        res.writeHead(200);
                        res.end(JSON.stringify({
                            status:"success"
                        }));
                    });
                }
                else{
                    database.user_shows.remove({ username:usernameSent, accessTokenSent:accessTokenSent, show:showSent }, function(error, docs){
                        if(error){
                            res.writeHead(500);
                            res.end(JSON.stringify({
                                error:error,
                                message:"sorry"
                            }));
                            return;
                        }
                        res.writeHead(200);
                        res.end(JSON.stringify({
                            status:"success"
                        }));
                    });
                }
            }
            else{
                res.writeHead(404);
                res.end(' { "error":"Invalid login. You should login again" } ');
            }
        });
    });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Subscription handler listening at http://%s:%s', host, port);
});
