document.addEventListener('DOMContentLoaded', function () {
   var loadedUsers = false;
   var loadedCharities = false;

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
                           $("#users").append($("<option />").val(element.id).text(element.name));
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
                               $("#charities").append($("<option />").val(element).text(element));
                           });
                         loadedCharities = true;
                         if(loadedCharities && loadedUsers) {
                           $(".crs").show();
                           $(".load").hide();
                         }
                       });
                   });
               } else {
                  alert("Please, enroll")
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
               console.log(data);
           }
       });

       //to request add_target
       $("#addTargetButton").click( function()
           {
               //some fields are constants, other we get from select in a form
               if (pagetype == "coursera_course" )    {
                  $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users").val() , bid: $("#bid").text() , url: url_for_request, type: pagetype, charity_type: $("#charities").val() } );
               }
               else   {
                  var expiretime;  //users deadline time to finish jis task
                  $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users").val() , bid: $("#bid").text() , url: url_for_request, type: pagetype, charity_type: $("#charities").val(), name: $("#name"), deadline: expiretime } );
               }
           }
       );

       }
   );
});
