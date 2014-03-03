function initialize_Map() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
      }

/*
 * jQuery functions from here on
 * Using jQuery 1.11.0
 */

/*
 * resizes the div#container to the remaining browser height
 */
var resizeContainer = function() {
	var headerHeight = $("#header").css("height");
	$("#container").css("padding-top", headerHeight);
	$("#container").css("margin-top", "-" + headerHeight);
};

/*
 * $(document).ready
 * 
 * initialize jQuery hooks
 */
$(function() {
	resizeContainer();
});