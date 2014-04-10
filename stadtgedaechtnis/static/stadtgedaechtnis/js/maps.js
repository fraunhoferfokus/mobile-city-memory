/**
 * Constant that identifies the map canvas.
 * @type {string}
 */
var MAP_ELEMENT = "map_canvas";

/**
 * Callback that is called when the location couldn't be retrieved.
 * @param error
 */
function errorLocationCallback (error) {
	// error callback
	userLocation.moveToLocation(this.DEFAULT_LAT, this.DEFAULT_LONG);
    alert('There was an error obtaining your position. Message: ' + error.message);
	//TODO: show hint that location couldn't be retrieved
}

function addMarker (location) {
    // calculate latitude and longitude
    var latitude = parseFloat(location.latitude._int) * Math.pow(10, location.latitude._exp);
    var longitude = parseFloat(location.longitude._int) * Math.pow(10, location.longitude._exp);

    // if not already on the map, display marker
    if (!userLocation.markers.hasOwnProperty(location.id)) {
        var marker = new google.maps.Marker({
            map: userLocation.map,
            position: new google.maps.LatLng(latitude, longitude),
            title: location.label,
            icon: "/static/stadtgedaechtnis/img/marker_story.png",
            animation: google.maps.Animation.DROP
        });

        var infoBox = new google.maps.InfoWindow({
            content: location.entries[0].abstract,
            maxWidth: 225
        })

        google.maps.event.addListener(marker, 'click', function() {
            userLocation.currentInfobox = infoBox;
            infoBox.open(userLocation.map, marker);
        });

        location.infobox = infoBox;
        location.marker = marker;
        userLocation.markers[location.id] = location;
    }
}

/**
 * Callback that is called when the viewport changed
 */
function searchForEntries () {
    // calculate bounds to search for
    var bounds = userLocation.map.getBounds()
    var max_lat = bounds.getNorthEast().lat().toFixed(10)
    var max_lon = bounds.getNorthEast().lng().toFixed(10)
    var min_lat = bounds.getSouthWest().lat().toFixed(10)
    var min_lon = bounds.getSouthWest().lng().toFixed(10)
    // get nearby locations
    $.getJSON("../stadtgedaechtnis/services/get-nearby-locations/" + min_lat + "/" + max_lat + "/" + min_lon + "/" + max_lon + "/", function (data) {
        $.each(data, function (index, value) {
            addMarker(value);
        })
    });
}

/**
 * Location object to enable/disable tracking the location and to retrieve the current or fallback location.
 * @param trackLocation
 * @constructor
 */
function Location() {
	this.DEFAULT_LAT = 50.258;
	this.DEFAULT_LONG = 10.965;
	this.DEFAULT_LOCATION = new google.maps.LatLng(50.258, 10.965);
	this.positionMarker = null;
    this.markers = {}
    this.currentInfobox = null;
}

/**
 * Move the map to the current location or the fallback
 * @returns {google.maps.LatLng|*}
 */
Location.prototype.moveToCurrentLocationOrFallback = function () {
	if (Modernizr.geolocation) {
	    google.maps.event.addListenerOnce(this.positionMarker, 'position_changed', function() {
            this.map.setCenter(this.getPosition());
            this.map.fitBounds(this.getBounds());
            searchForEntries();
        });
	} else {
		this.moveToLocation(this.DEFAULT_LAT, this.DEFAULT_LONG);
		//TODO: show hint that browser doesn't support location
	}
};

/**
 * Moves the map to the given location
 * @param lat
 * @param long
 */
Location.prototype.moveToLocation = function(position) {
	if (this.map) {
		this.map.panTo(position);
        searchForEntries();
	}
}

var userLocation = new Location();

/**
 * Global map Options
 * @type {{center: google.maps.LatLng, zoom: number, mapTypeId: *, disableDefaultUI: boolean, zoomControl: boolean}}
 */
var mapOptions = {
	center: userLocation.DEFAULT_LOCATION,
	zoom: 17,
    mapTypeControl: true,
	mapTypeId: google.maps.MapTypeId.SATELLITE,
	disableDefaultUI: true,
	zoomControl: true
};

/**
 * Initializes the map
 */
function initialize_Map() {
	userLocation.map = new google.maps.Map(document.getElementById(MAP_ELEMENT),
		mapOptions);
    userLocation.positionMarker = new GeolocationMarker(userLocation.map)
    userLocation.moveToCurrentLocationOrFallback();
    google.maps.event.addListener(userLocation.positionMarker, 'geolocation_error', errorLocationCallback);
    google.maps.event.addListener(userLocation.map, 'idle', searchForEntries)
    google.maps.event.addListener(userLocation.map, 'click', function(mouseevent) {
        if (userLocation.currentInfobox != null) {
            userLocation.currentInfobox.close();
            mouseevent.stop();
        }
    })
}