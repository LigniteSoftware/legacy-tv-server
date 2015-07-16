var http = require('http');
var qs = require('querystring');
var mongo = require('mongojs');

var server = http.createServer(function(req, res){
    var data = '';
    req.on('data', function(chunk) {
        data += chunk;
    }).on('end', function() {
        console.log('POST data: %s', data);
        if(data == ""){
            res.writeHead(400);
            res.end(' { "error":"bad request" }');
        }
        else{
            var post = qs.parse(data);
            var database = mongo('money', ['balances']);
            var returnvalue = null;
            database.balances.find({ "raw_name":post.rawName }, function(something, docs){
                if(docs == ""){
                    console.log("not ok");
                    res.writeHead(404);
                    res.end('{ "error":"not found" }');
                }
                else{
                    res.writeHead(200);
                    res.end(JSON.stringify(docs[0]));
                }
            });
        }
    })
});

var port = 8080;
server.listen(port);
