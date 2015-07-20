var exec = require("child_process").exec;

setInterval(function(){
  exec("perl data_creator/zap2xml2.pl -u contact@edwinfinch.com -p GetShrekscoped -d 4", function (error, stdout, stderror) {
      if(error){
          console.log("Error:\n" + error);
      }
      console.log("Output:\n" + stdout);
      return;
      if(stdout.toString().includes("Completed")){
          console.log("Completed!\nConverting data...");
          exec("php data_creator/convert.php", function (error, stdout, stderror) {
              if(error){
                  console.log("Error:\n" + error);
              }
              console.log("Output:\n" + stdout);
              if(stderror){
                  console.log("STD Error:\n" + stderror);
              }
              /*
              exec("", function (error, stdout, stderror) {
                  if(error){
                      console.log("Error:\n" + error);
                  }
                  console.log("Output:\n" + stdout);
                  if(stderror){
                      console.log("STD Error:\n" + stderror);
                  }
              });
              */
          });
      }
      if(stderror){
          console.log("STD Error:\n" + stderror);
      }
  });
}, 3000);
