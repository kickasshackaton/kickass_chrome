document.addEventListener('DOMContentLoaded', function () {
   chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
   function(tabs){
       var url_for_request;    //current tab url (where we clicked plugin button)

       var pagetype = "omni";     //depends on the page we are located at, is coursera we use "coursera_course"
       url_for_request = tabs[0].url;       //save current tab url

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
                   $("#add-custom-form").hide();
                   $("#add-coursera-form").show();
                   //get list of friends to witness
                   $.get( "http://griev.ru:6543/list_users", function( data ) {
                       data.user_list.forEach(function(element, index){
                           //fill select field of friends
                           $("#users").append($("<option />").val(element.id).text(element.name));
                       });
                   });

                   //choose fund to send money to
                   $.get( "http://griev.ru:6543/get_charity_funds", function( data ) {


                       $.each( data, function( key, value ) {
                           value.forEach(function(element, index){
                               $("#charities").append($("<option />").val(element).text(element));
                           });
                       });
                   });
               } else {
                  alert("Please, enroll")
               }
             } else {
               $("#add-custom-form").show();
               $("#add-coursera-form").hide();
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
                  expiretime = Math.round(new Date().getTime()/1000) + 60*60*24*( $("#deadline"));          //user is notified when 1, 3, 5 or 7 days left
                  $.post( "http://griev.ru:6543/add_target", { user: "1" , overseer: $("#users").val() , bid: $("#bid").text() , url: url_for_request, type: pagetype, charity_type: $("#charities").val(), name: $("#name"), deadline: expiretime } );
               }
           }
       );

       }
   );
});
