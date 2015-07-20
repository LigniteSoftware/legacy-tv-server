var exec = require("child_process").exec;

setInterval(function(){
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
              if(error){
                  console.log("Error:\n" + error);
              }
              console.log("Output:\n" + stdout);
          });
      });
  });
}, 60 * 60 * 1000);
