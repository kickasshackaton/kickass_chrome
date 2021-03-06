document.addEventListener('DOMContentLoaded', function () {
   var loadedUsers = false;
   var loadedCharities = false;

  $("#bid_crs").focus();

  $(".load").show();
  $(".cst").hide();
  $(".crs").hide();

   chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
       var url_for_request;    //current tab url (where we clicked plugin button)

       var pagetype = "omni";     //depends on the page we are located at, is coursera we use "coursera_course"
       url_for_request = tabs[0].url;       //save current tab url

       $(".thispage").val(url_for_request);

       if (tabs[0].url.indexOf("class.coursera.org") != -1)
       {
           pagetype = "coursera_course";
       }

       else if (tabs[0].url.indexOf("coursera.org/course/") != -1)
       {
           pagetype = "coursera_course";
       }

       //asking our server to check our target
       $.get( "http://griev.ru:6543/check_target?url="+ url_for_request +"&user_id=1", function( data ) {

           if (data.result == false)
           {   //fill form

             if(pagetype == "coursera_course") {
               if (data.enrolled == true)     //if user already study this course
               {
                   $(".cst").hide();
                   $(".crs").show();
                   //get list of friends to witness
                   $.get( "http://griev.ru:6543/list_users", function( data ) {
                       data.user_list.forEach(function(element, index){
                           //fill select field of friends
                           $("#users_crs").append($("<option />").val(element.id).text(element.name));
                       });
                       loadedUsers = true;
                       if(loadedCharities && loadedUsers) {
                         $(".crs").show();
                         $(".load").hide();
                       }
                   });

                   //choose fund to send money to
                   $.get( "http://griev.ru:6543/get_charity_funds", function( data ) {


                       $.each( data, function( key, value ) {
                           value.forEach(function(element, index){
                               $("#charities_crs").append($("<option />").val(element).text(element));
                           });
                         loadedCharities = true;
                         if(loadedCharities && loadedUsers) {
                           $(".crs").show();
                           $(".load").hide();
                         }
                       });
                   });
               } else {
                   $(".load").html("<div style='margin:80px 30px 30px 30px;' class=\"alert alert-danger\"><h2>Sorry</h2>You must enroll in this course first.</br><br/><a class=\"btn btn-default\" href=\"\">Check again</a></div>");
               }
             } else {
               $(".crs").hide();
               //get list of friends to witness
               $.get( "http://griev.ru:6543/list_users", function( data ) {
                 data.user_list.forEach(function(element, index){
                   //fill select field of friends
                   $("#users_cst").append($("<option />").val(element.id).text(element.name));
                 });
                 loadedUsers = true;
                 if(loadedCharities && loadedUsers) {
                   $(".cst").show();
                   $(".load").hide();
                 }
               });

               //choose fund to send money to
               $.get( "http://griev.ru:6543/get_charity_funds", function( data ) {


                 $.each( data, function( key, value ) {
                   value.forEach(function(element, index){
                     $("#charities_cst").append($("<option />").val(element).text(element));
                   });
                   loadedCharities = true;
                   if(loadedCharities && loadedUsers) {
                     $(".cst").show();
                     $(".load").hide();
                   }
                 });
               });
             }
           }
           else
           {   //check JSON answer
               //alert("Here we decode JSON answer: " + data.target.JSON.toString());
                 $(".crs-target").show();
                 $(".load").hide();

                 $("#crs-target-title").text(data.target.name);
                 $("#crs-target-bid").text("$" + data.target.bid);

                 var now = new Date(data.target.deadline * 1000);
                 var month = now.getMonth() + 1;
                 $("#crs-target-deadline").text(month + "/" + now.getDay() + "/" + now.getFullYear());

           }
       });

       //to request add_target
       $("#addTargetButton_cst").click( function()
           {
               $(".cst").hide();
               $(".load").show();
               $(".loadtext").text("Adding webpage...");
               //some fields are constants, other we get from select in a form
               if (pagetype == "coursera_course" )    {
                  $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users_crs").val() , bid: $("#bid_crs").val() , url: url_for_request, type: pagetype, charity_type: $("#charities_crs").val() })
                  .done(function( data ) {
                    $(".load > img").hide();
                    $(".loadtext").text("Done!");
                  });
               }
               else   {
                  var expiretime;  //users deadline time to finish jis task
                  var daysleft;     // 1,3,5 or 7 days
                  daysleft = $('input[type="radio"]:checked').val();

                  var pname = tabs[0].title;

                  expiretime = Math.round(new Date().getTime()/1000) + 60*60*24*daysleft;          //user is notified when 1, 3, 5 or 7 days left
                  $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users_cst").val() , bid: $("#bid_cst").val() , url: url_for_request, type: pagetype, charity_type: $("#charities_cst").val(), name: pname, deadline: expiretime } )
                  .done(function( data ) {
                        $(".load > img").hide();
                      $(".loadtext").text("Done!")
                   });
                }
           }
       );

     //to request add_target
     $("#addTargetButton_crs").click( function()
         {
           $(".crs").hide();
           $(".load").show();
           $(".loadtext").text("Adding course...");
           //some fields are constants, other we get from select in a form
           if (pagetype == "coursera_course" )    {
             $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users_crs").val() , bid: $("#bid_crs").val() , url: url_for_request, type: pagetype, charity_type: $("#charities_crs").val() })
                 .done(function( data ) {
                   $(".load > img").hide();
                   $(".loadtext").text("Done!");
                 });
           }
           else   {
             var expiretime;  //users deadline time to finish jis task
             var daysleft;     // 1,3,5 or 7 days
             daysleft = $('input[type="radio"]:checked').val();

             var pname = tabs[0].title;

             expiretime = Math.round(new Date().getTime()/1000) + 60*60*24*daysleft;          //user is notified when 1, 3, 5 or 7 days left
             $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users_cst").val() , bid: $("#bid_cst").val() , url: url_for_request, type: pagetype, charity_type: $("#charities_cst").val(), name: pname, deadline: expiretime } )
                 .done(function( data ) {
                   $(".load > img").hide();
                   $(".loadtext").text("Done!")
                 });
           }
         }
     );

       }
   );
});
