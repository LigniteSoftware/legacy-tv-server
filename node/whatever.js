
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
var fs = require('fs');
var mongo = require('mongojs');
var done = false;
function readTextFile(){
if(done){return;}

                var allText;

console.log("reading file");
fs.readFile('/var/www/tv/data.json', 'utf8', function (err,data) {
  if (err || done) {
    return console.log(err);
  }
  //console.log(data);
console.log("got data");
var allText = data;
done = true;
//console.log("alltext: " + allText); 

                var rstring = replaceAll("@attributes", "attributes", replaceAll('"previously-shown":{}', '"new":false', replaceAll('"new":{}', '"new":true', allText)));

                var database = mongo('tv', ['base']);

                console.log("parsed");
                database.base.insert(JSON.parse(rstring));

                return;
});

}

readTextFile();
