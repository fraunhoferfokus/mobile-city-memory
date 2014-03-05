var MAP_ELEMENT = "map_canvas";

/**
 * Location object to enable/disable tracking the location and to retrieve the current or fallback location
 * @param trackLocation
 * @constructor
 */
function Location() {
	this.DEFAULT_LAT = 50.258;
	this.DEFAULT_LONG = 10.965;
	this.DEFAULT_LOCATION = new google.maps.LatLng(50.258, 10.965);

	this.currentLocation = this.DEFAULT_LOCATION;

	/**
	 * enable location tracking
	 */
	this.__defineGetter__("trackLocation", function () {
		return tracking;
	})

	/**
	 * disable location tracking
	 */
	this.__defineSetter__("trackLocation", function (trackLocation) {
		tracking = trackLocation;
	})
}

/**
 * Move the map to the current location or the fallback
 * @returns {google.maps.LatLng|*}
 */
Location.prototype.moveToCurrentLocationOrFallback = function () {
	alert(Modernizr.geolocation);
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(
			// success callback
			function (position) {
				alert(position);
				this.moveToLocation(position.coords.latitude, position.coords.longitude);
				//TODO: maybe add accuracy?
			},
			// error callback
			function () {
				alert("Error");
				this.moveToLocation(this.DEFAULT_LAT, this.DEFAULT_LONG);
				//TODO: show hint that location couldn't be retrieved
			}
		);
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
		var newLocation = new google.maps.LatLng(lag, long);
		this.currentLocation = newLocation;
		map.panTo(newLocation);
	}
}

var UserLocation = new Location();

/**
 * Global map Options
 * @type {{center: google.maps.LatLng, zoom: number, mapTypeId: *, disableDefaultUI: boolean, zoomControl: boolean}}
 */
var mapOptions = {
	center: UserLocation.DEFAULT_LOCATION,
	zoom: 17,
	mapTypeId: google.maps.MapTypeId.SATELLITE,
	disableDefaultUI: true,
	zoomControl: true
};

/**
 * Initializes the map
 */
function initialize_Map() {
	UserLocation.map = new google.maps.Map(document.getElementById(MAP_ELEMENT),
		mapOptions);
	UserLocation.moveToCurrentLocationOrFallback();
}