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
Location.prototype.moveToLocation = function(lat, long) {
	if (this.map) {
		var newLocation = new google.maps.LatLng(lat, long);
		this.map.panTo(newLocation);
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
}