<!DOCTYPE html>
<html>
  <head>
    <title>TV Shows</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
    <script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="//code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
  </head>
  <body>
    <div data-role="page" id="main">
      <div data-role="header" class="jqm-header">
        <h1>TV Shows</h1>
      </div>

      <div data-role="content">

<div data-role="collapsible-set" data-theme="c" data-content-theme="d" data-mini="false">

    <div data-role="collapsible" id="channels-content">
        <h3>crap</h3>
        <div data-role="collapsible">
            <h3>everything is broken</h3>
            hello
        </div>
   </div>

   <div data-role="collapsible">
          <h3>Shows</h3>

          <div data-role="collapsible" id="shows-content">

          </div>

  </div>

 <div data-role="collapsible">
        <h3>Search by show</h3>

        <fieldset data-role="controlgroup" data-mini="true">
            <div class="ui-field-contain">
              <label for="tipsyWord1" id="label_tipsyWord1">Specific show:</label>
              <input name="tipsyWord1" id="trans_tipsyWord1" placeholder="Enter Translation" value="shittin" data-mini="true" type="text" maxlength="16">
            </div>
        </fieldset>

</div>

<div data-role="collapsible">
       <h3>Search by channel</h3>

       <fieldset data-role="controlgroup" data-mini="true">
           <div class="ui-field-contain">
             <label for="tipsyWord1" id="label_tipsyWord1">Specific channel:</label>
             <input name="tipsyWord1" id="trans_tipsyWord1" placeholder="Enter Translation" value="shittin" data-mini="true" type="text" maxlength="16">
           </div>
       </fieldset>

</div>
</div>
<br />
        <div class="ui-body ui-body-c">
          <fieldset class="ui-grid-a">
              <div class="ui-block-a"><button type="submit" data-theme="d" id="b-cancel">Cancel</button></div>
              <div class="ui-block-b"><button type="submit" data-theme="a" id="b-submit">Save</button></div>
          </fieldset>
        </div>
      </div>
    </div>
    <script>
    $( document ).ready(function() {
        console.log( "ready punk" );
        $.ajax({
          type: "POST",
          url: "http://tv.edwinfinch.com:52382",
          data: "request_type=all_channels",
          success: function(data){
              console.log("Success!");
              var channels = data.channel;
              var channels_area = document.getElementById("channels-content");
              for(var i = 0; i < channels.length; i++){
                  console.log("adding " + i);
                  channels_area.innerHTML += '<div class="ui-collapsible-content ui-body-d" aria-hidden="false"><div data-role="collapsible" class="ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content ui-collapsible-collapsed"><h3 class="ui-collapsible-heading ui-collapsible-heading-collapsed"><a href="#" class="ui-collapsible-heading-toggle ui-btn ui-btn-icon-left ui-btn-c ui-icon-plus">' + channels[i].display_name[2] + '<span class="ui-collapsible-heading-status"> click to expand contents</span></a></h3><div class="ui-collapsible-content ui-body-d ui-collapsible-content-collapsed" aria-hidden="false">hello</div></div>'
              }
              console.log("Got channels " + JSON.stringify(channels));
          },
          error: function(data){
              console.log("Error: " + JSON.stringify(data));
          },
          dataType: "json"
        });
    });
    </script>
    <script>
      function saveOptions() {
        var options = {
              'theme':     Number( $("input[name=key0]:checked").val() ),
              'soberWord1': $("input[name=soberWord1]").val(),

        }
        return options;
      }
      $().ready(function() {
       if (typeof window.localStorage !== "undefined") {
       	console.log("Not undefined :)");
        if (window.localStorage.pebble_drunkoclock2_options) {
          ls_pto = JSON.parse(window.localStorage.pebble_drunkoclock2_options);
            //Sober
            $("input[name=soberWord1]").val(ls_pto["soberWord1"]);
        }
       }
        $("#b-cancel").click(function() {
          console.log("Cancel");
          document.location = "pebblejs://close";
        });
        $("#b-submit").click(function() {
          console.log("Submit");
          ls_pto = JSON.stringify(saveOptions());
          if (typeof window.localStorage !== "undefined") {
            window.localStorage.pebble_drunkoclock2_options = ls_pto;
          }
          var location = "pebblejs://close#" + encodeURIComponent(ls_pto);
          console.log("Warping to: " + location);
          console.log(location);
          document.location = location;
        });
      });
    </script>
  </body>
</html>

<!--
<!DOCTYPE html>
<html>

<head>
    <title></title>
    <link rel='stylesheet' type='text/css' href='slate/dist/css/slate.css'>
    <script src='slate/dist/js/slate.min.js'></script>
    <script src="//code.jquery.com/jquery-1.11.3.js"></script>
    <script src="//code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
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
    </script>
</head>
<body>
    <br>
    <h1 class='title'>TV Guides by Lignite</h1>

    <div class='item-container'>
        <div class="item-container-header">All channels</div>
        <div class="item-container-content">
            <label class="item" for="channel_search">
                <div class="item-input-wrapper item-input-wrapper-button">
                    <input id="channel_search" class="item-input">
                </div>
                <input type="button" class="item-button item-input-button" value="Search" id="channel_search_button">
            </label>
        </div>
    </div>

    <div class='item-container'>
        <div class="item-container-header">Search by specific show name</div>
        <div class="item-container-content">
            <label class="item" for="show_search">
                <div class="item-input-wrapper item-input-wrapper-button">
                    <input id="show_search" class="item-input">
                </div>
                <input type="button" class="item-button item-input-button" value="Search" id="show_search_button">
            </label>
        </div>
    </div>

    <div class='item-container'>
        <div class="item-container-header">Search by specific channel name</div>
        <div class="item-container-content">
            <label class="item" for="channel_search">
                <div class="item-input-wrapper item-input-wrapper-button">
                    <input id="channel_search" class="item-input">
                </div>
                <input type="button" class="item-button item-input-button" value="Search" id="channel_search_button">
            </label>
        </div>
    </div>

    <div class='item-container' align="center">
        <div class="item-container-header">Aboot</div>
            <div class="item">
                TV Shows was created by <a href="https://www.lignite.io">Team Lignite</a> (developer: <a href="https://www.edwinfinch.com/">Edwin Finch</a>, designer: <a href="http://iphibse.ch">Philipp Weder</a>), the team who created the Lignite Collection for Pebble and Pebble Time.<br><br>

                TV Shows won the 12th week of the Timeline Challenge created by Pebble! We're very honored to have won this award, and thank you for using our app.
            </div>
        </div>
    </div>
</body>
<script>

var searchShowsButton = document.getElementById('show_search_button');
searchShowsButton.addEventListener('click', function() {
    var data = "request_type=show_detail&request_name=" + document.getElementById("show_search").value;
    console.log(data);
    $.ajax({
      type: "POST",
      url: "http://tv.edwinfinch.com:52382",
      data: data,
      success: function(data){
          console.log("Success! " + JSON.stringify(data));
      },
      error: function(data){
          console.log("Error: " + JSON.stringify(data));
      },
      dataType: "json"
    });
});

var channelShowsButton = document.getElementById('channel_search_button');
channelShowsButton.addEventListener('click', function() {

});

</script>
</html>
-->
