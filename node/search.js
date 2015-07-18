var http = require('http');
var qs = require('querystring');
var mongo = require('mongojs');

var server = http.createServer(function(req, res){
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

var port = 1000;
server.listen(port);
