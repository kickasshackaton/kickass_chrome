// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'kittens';

var kittenGenerator = {
  /**
   * Flickr URL that will give us lots and lots of whatever we're looking for.
   *
   * See http://www.flickr.com/services/api/flickr.photos.search.html for
   * details about the construction of this URL.
   *
   * @type {string}
   * @private
   */
  searchOnFlickr_: 'https://secure.flickr.com/services/rest/?' +
      'method=flickr.photos.search&' +
      'api_key=90485e931f687a9b9c2a66bf58a3861a&' +
      'text=' + encodeURIComponent(QUERY) + '&' +
      'safe_search=1&' +
      'content_type=1&' +
      'sort=interestingness-desc&' +
      'per_page=20',

  /**
   * Sends an XHR GET request to grab photos of lots and lots of kittens. The
   * XHR's 'onload' event is hooks up to the 'showPhotos_' method.
   *
   * @public
   */
  requestKittens: function() {
    var req = new XMLHttpRequest();
    req.open("GET", this.searchOnFlickr_, true);
    req.onload = this.showPhotos_.bind(this);
    req.send(null);
  },

  /**
   * Handle the 'onload' event of our kitten XHR request, generated in
   * 'requestKittens', by generating 'img' elements, and stuffing them into
   * the document for display.
   *
   * @param {ProgressEvent} e The XHR ProgressEvent.
   * @private
   */
  showPhotos_: function (e) {
    var kittens = e.target.responseXML.querySelectorAll('photo');
    for (var i = 0; i < kittens.length; i++) {
      var img = document.createElement('img');
      img.src = this.constructKittenURL_(kittens[i]);
      img.setAttribute('alt', kittens[i].getAttribute('title'));
      document.body.appendChild(img);
    }
  },

  /**
   * Given a photo, construct a URL using the method outlined at
   * http://www.flickr.com/services/api/misc.urlKittenl
   *
   * @param {DOMElement} A kitten.
   * @return {string} The kitten's URL.
   * @private
   */
  constructKittenURL_: function (photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_s.jpg";
  }
};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {


     chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
     function(tabs){
         var url_for_request;    //current tab url (where we clicked plugin button)

         url_for_request = tabs[0].url;       //save current tab url

     if (tabs[0].url.indexOf("class.coursera.org") != -1)
     {
     //alert("This is class page");
     //return
     }

     else if (tabs[0].url.indexOf("coursera.org/course/") != -1)
     {
     //alert("This is course page");
     //return
     }

     //asking our server to check our target
     $.get( "http://griev.ru:6543/check_target?url="+ url_for_request +"&user_id=1", function( data ) {

         if (data.result == false)
         {   //fill form
             if (data.enrolled == true)     //if user already study this course
             {
                 //get list of friends to witness
                 $.get( "http://griev.ru:6543/list_users", function( data ) {
                     //$( ".result" ).html( data );
                     data.user_list.forEach(function(element, index) {
                         //work with each friend name
                         console.log(element);
                     });
                     alert( "Load was performed." );
                 });

                 //choose fund to send money to
                 $.get( "http://griev.ru:6543/get_charity_funds", function( data ) {


                     $.each( data, function( key, value ) {
                         console.log( key + ": " + value );
                     });
                     //$( ".result" ).html( data );
                     //alert( "Load was performed." );
                 });

                 //alert ("Fill up the form");
             }
             else
              {
                alert("Please, enroll")
              }
             //alert("Here we should fill the form");
         }
         else
         {   //check JSON answer
             //alert("Here we decode JSON answer: " + data.target.JSON.toString());
             console.log(data);
         }
         //$( ".result" ).html( data );
         //alert( "Load was performed." );
         //alert(data.result);
     });

     //alert(tabs[0].url);
     //alert( url_for_request );
     }
     );






  //kittenGenerator.requestKittens();


});