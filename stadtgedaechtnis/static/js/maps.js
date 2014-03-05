var MAP_ELEMENT = "map_canvas";

var positionMarker;

function successLocationCallback (position) {
	//success callback
	UserLocation.moveToLocation(position.coords.latitude, position.coords.longitude);
	if (!positionMarker) {
		positionMarker = new google.maps.Marker({
			position: UserLocation.map.getCenter(),
			map: UserLocation.map,
			animation: google.maps.Animation.DROP,
			clickable: false,
			icon: "static/img/marker_position.png"
		});
	}
	//TODO: maybe add accuracy?
}

function errorLocationCallback (error) {
	// error callback
	alert(error.id);
	UserLocation.moveToLocation(this.DEFAULT_LAT, this.DEFAULT_LONG);
	//TODO: show hint that location couldn't be retrieved
}

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

	var trackingID;
	var tracking = false;

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
		if (Modernizr.geolocation && trackLocation) {
			trackingID = navigator.geolocation.watchPosition(successLocationCallback, errorLocationCallback, {enableHighAccuracy: true});
		} else if (!trackLocation) {
			navigator.geolocation.clearWatch(trackingID);
		}
		tracking = trackLocation;
	})

}

/**
 * Move the map to the current location or the fallback
 * @returns {google.maps.LatLng|*}
 */
Location.prototype.moveToCurrentLocationOrFallback = function () {
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(successLocationCallback, errorLocationCallback,{enableHighAccuracy: true});
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
		this.currentLocation = newLocation;
		this.map.panTo(newLocation);
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
	UserLocation.trackLocation = true;
}