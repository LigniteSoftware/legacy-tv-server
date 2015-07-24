<!DOCTYPE html>
<html>
  <head>
  <title>TV Shows</title>
  <link rel='stylesheet' type='text/css' href='slate/dist/css/slate.css'>
  <script src='slate/dist/js/slate.min.js'></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <style>
  .title {
    padding: 3px 10px;
    text-transform: uppercase;
    font-family: 'PT Sans', sans-serif;
    font-size: 1.2em;
    font-weight: 500;
  }
  .title2 {
    padding: 3px 10px;
    text-transform: uppercase;
    font-family: 'PT Sans', sans-serif;
    font-size: 0.6em;
    font-weight: 500;
  }
  </style>
  </head>

  <body>
    <br>
    <h1 class='title'>TV Shows</h1>

<div id="login_section">
    <div class='item-container'>
      <div class='item-container-content'>
        <div class='item' id="login_header">
          Have an account?
        </div>
      </div>
    </div>

    <div class="item-container">
      <div class="item-container-header">Login</div>
      <div class="item-container-content">
        <label class="item">
          <div class="item-input-wrapper">
            <input type="text" class="item-input" id="lusername" placeholder="Username">
          </div>
        </label>
      </div>
      <div class="item-container-content">
        <label class="item">
          <div class="item-input-wrapper">
            <input type="email" class="item-input" id="lemail" placeholder="Email">
          </div>
        </label>
      </div>
      <div class="item-container">
        <div class="button-container">
          <input type="button" class="item-button" id="login_button" value="Login">
        </div>
      </div>
    </div>
</div>

<div id="create_section">
    <div class='item-container'>
      <div class='item-container-content'>
        <div class='item' id="create_header">
          New user?
        </div>
      </div>
    </div>

      <div class="item-container-header">Create an account</div>
      <div class="item-container-content">
        <label class="item">
          <div class="item-input-wrapper">
            <input type="text" class="item-input" id="cusername" placeholder="Username">
          </div>
        </label>
      </div>
      <div class="item-container-content">
          <label class="item">
              <div class="item-input-wrapper">
                  <input type="email" class="item-input" id="cemail" placeholder="Email">
              </div>
          </label>
      </div>
      <br>
      <p align="center">By creating an account, you agree to our <a href="terms.html">terms and conditions</a>. We will <b>never ever</b> use your email for anything other than
          our service, because that wouldn't be very Canadian of us.</p>
      <div class="item-container">
        <div class="button-container">
          <input type="button" class="item-button" id="create_button" value="Create">
        </div>
      </div>
</div>
</body>
<script>
    function checkAccount(username, email, new_account) {
        var response;
        var req = new XMLHttpRequest();
        var address = "http://tv.edwinfinch.com:2000";
        req.open('POST', address, true);
        req.onload = function(e) {
            if (req.readyState == 4 && req.status == 200) {
                response = JSON.parse(req.responseText);
                if(new_account){
                    document.getElementById("create_header").innerHTML = "Created! Redirecting...";
                }
                else{
                    document.getElementById("login_header").innerHTML = "Logged in! Redirecting...";
                }
                var accessToken = response.accessToken;
                var usernameLoaded = response.username;
                document.location = "pebblejs://close#" + encodeURIComponent(JSON.stringify({
                    "accessToken":accessToken,
                    "username":usernameLoaded
                }));
          }
          else{
              if(new_account){
                  document.getElementById("create_header").innerHTML = "Whoopsies, " + JSON.parse(req.responseText).error;
              }
              else{
                  document.getElementById("login_header").innerHTML = "Whoopsie daisies, " + JSON.parse(req.responseText).error;
              }
              return;
          }
        };

        var toSend = "is_new=" + new_account + "&username=" + username + "&email=" + email;
        console.log("Sending: " + toSend);
        req.send(toSend);
    }

    function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var value = re.test(email);
        console.log("value of " + value + " when testing email " + email);
        return value;
    }
    function validateUsername(fld) {
        var error = "";
        var illegalChars = /\W/; // allow letters, numbers, and underscores

        if (fld == "") {
            return false;

        } else if ((fld.length < 5) || (fld.length > 15)) {
    		return false;

        } else if (illegalChars.test(fld)) {
    		return false;

        }
        return true;
    }
  function getLoginData() {
    var lusername = document.getElementById('lusername');
    var lemail = document.getElementById('lemail');

    var options = {
      'username': lusername.value,
      'email': lemail.value
    };
    // Save for next launch
    localStorage['username'] = options['username'];
    console.log('Got login options: ' + JSON.stringify(options));
    return options;
  }
  function getCreateData() {
    var cusername = document.getElementById('cusername');
    var cemail = document.getElementById('cemail');

    var options = {
      'username': cusername.value,
      'email': cemail.value
    };
    // Save for next launch
    localStorage['username'] = options['username'];
    localStorage['email'] = options['email'];
    console.log('Got create options: ' + JSON.stringify(options));
    return options;
}
  
  var submitButton = document.getElementById('login_button');
  submitButton.addEventListener('click', function() {
    console.log('Login');
    document.getElementById('login_header').innerHTML = "Logging in...";

    if(!validateUsername(document.getElementById("lusername").value)){
        document.getElementById('login_header').innerHTML = "Username must be between 5 and 15 characters, and contain only letters, numbers, and underscores.";
        return;
    }

    if(!validateEmail(document.getElementById("lemail").value)){
        document.getElementById('login_header').innerHTML = "Improper email format... Please try again. Example email: ellenpao@resigned.com";
        return;
    }

    checkAccount(document.getElementById("lusername").value, document.getElementById("lemail").value, false);
  });
  var createButton = document.getElementById('create_button');
  createButton.addEventListener('click', function() {
    console.log('Create');
    document.getElementById('create_header').innerHTML = "Creating account (and signing in)...";
    document.getElementById('login_section').innerHTML = "";

    if(!validateUsername(document.getElementById("cusername").value)){
        document.getElementById('create_header').innerHTML = "Username must be between 5 and 15 characters, and contain only letters, numbers, and underscores.";
        return;
    }

    if(!validateEmail(document.getElementById("cemail").value)){
        document.getElementById('create_header').innerHTML = "Improper email format... Please try again. Example email: ellenpao@resigned.com";
        return;
    }

    checkAccount(document.getElementById("cusername").value, document.getElementById("cemail").value, true);
  });
  (function() {
    console.log("hello");
  })();
  </script>
</html>
