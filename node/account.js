var http = require('http');
var express = require('express');
var randomstring = require('randomstring');
var mongo = require('mongojs');
var fs = require('fs');
var qs = require('querystring');

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
            console.log("No data in request");
            res.end(' { "error":"bad request" } ');
            return;
        }
        var post = qs.parse(data);
        var database = mongo('tv', ['users']);
        var usernameSent = post.username, emailSent = post.email;

        var usernameUsed = false, emailUsed = false, usernameCheck = false, emailCheck = false;
        database.users.find({ username:usernameSent }, function(error, docs){
            if(docs[0]){
                if(post.is_new === "true"){
                    res.writeHead(400);
                    res.end(' { "error":"username already taken, sorry" }');
                }
                usernameUsed = true;
            }
            usernameCheck = true;
            if(emailCheck && usernameCheck){
                clearedForDuty();
            }
        });
        database.users.find({ email:emailSent }, function(error, docs){
            if(docs[0]){
                if(post.is_new === "true"){
                    res.writeHead(400);
                    res.end(' { "error":"email already being used, sorry" }');
                }
                emailUsed = true;
            }
            emailCheck = true;
            if(emailCheck && usernameCheck){
                clearedForDuty();
            }
        });

        function clearedForDuty(){
            var tokenGen = randomstring.generate(10);

            console.log(tokenGen + " is cleared for duty.");
            //username and email not taken...
            if(post.is_new === "true"){
                if(usernameUsed || emailUsed) return;

                database.users.insert({ username:usernameSent, email:emailSent, accessToken:tokenGen });
                res.writeHead(200);
                var result = {
                    username:usernameSent,
                    email:emailSent,
                    accessToken:tokenGen,
                    new:true
                };
                res.end(JSON.stringify(result));
            }
            else{
                if(usernameUsed && emailUsed){
                    database.users.update({ username:usernameSent, email:emailSent }, { username:usernameSent, email:emailSent, accessToken:tokenGen }, function(error, result){
                        if(error){
                            res.writeHead(500);
                            res.end(' {"error":"an error occurred: " ' + error + '"}');
                            return;
                        }
                        res.writeHead(200);
                        var result = {
                            username:usernameSent,
                            email:emailSent,
                            accessToken:tokenGen,
                            new:false
                        };
                        res.end(JSON.stringify(result));
                    });
                }
                else{
                    res.writeHead(404);
                    res.end(' { "error":"there is no account with those credentials, please triple check! (404)" } ');
                }
            }
        }
    });
});

var server = app.listen(2000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Accounts app listening at http://%s:%s', host, port);
});
