/**
 * Constant that identifies the map canvas.
 * @type {string}
 */
var MAP_ELEMENT = "map_canvas";

var channel = "mobile";

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

    var entryCount = location.entries.length;
    if (entryCount > 9) {
        entryCount = 0;
    }
    // if not already on the map, display marker
    if (!userLocation.markers.hasOwnProperty(location.id)) {
        var marker = new google.maps.Marker({
            map: userLocation.map,
            position: new google.maps.LatLng(latitude, longitude),
            title: location.label,
            icon: "/static/stadtgedaechtnis/img/marker_" + entryCount + ".png",
            animation: google.maps.Animation.DROP
        });

        location.marker = marker;
        createInfobox(location);

        userLocation.markers[location.id] = location;
    }
}

/**
 * Creates an infobox for this location.
 * @param location
 */
function createInfobox(location) {
    if (location.entries.length > 1) {
        location.heading = location.entries[0].title;
        location.image = location.entries[0].image;
        location.alt = location.entries[0].alt;
        location.entryid = location.entries[0].id;
        var infoBoxContent = "<p class='infowindow'>" + location.entries[0].abstract + "</p>";
    } else {
        location.heading = location.entries[0].title;
        location.image = location.entries[0].image;
        location.alt = location.entries[0].alt;
        location.entryid = location.entries[0].id;
        var infoBoxContent = "<p class='infowindow'>" + location.entries[0].abstract + "</p>";
    }

    var infoBox = new google.maps.InfoWindow({
        content: infoBoxContent,
        maxWidth: 225
    })

    location.infobox = infoBox;
    google.maps.event.addListener(location.marker, 'click', function () {
        openEntry(location);
    });
    google.maps.event.addListener(infoBox, 'closeclick', closeEntry);
}

/**
 * Opens an infobox for the first entry in this
 * location and pops up the pop up with the
 * correct heading and image. Handles click
 * events on the marker.
 * @param entry
 */
function openEntry(location) {
    $("section#article-section h3").text(location.heading);
    if (location.image !== undefined) {
        $("section#article-section img#entry-first").show().attr({
            src: location.image,
            alt: location.alt
        });
    } else {
        $("section#article-section img#entry-first").hide();
    }
    if (location.entries.length > 1) {
        $("div.entry-slide").show();
    } else {
        $("div.entry-slide").hide();
    }
    $("article#entry-more").html("");
    $("img#load-more").show();
    $.get("../stadtgedaechtnis/entry/" + location.entryid + "/", function (data) {
        $("article#entry-more").html(data);
        $("img#load-more").hide();
    });

    if (userLocation.currentInfobox === null) {
        var footer = $("section#article-section");
        var footerHeading = $("section#article-section h3");
        footer.css("padding", "0.8rem");

        if ($(window).width() < 768) {
            // mobile
            channel = "mobile";
            footer.transition({height: footerHeight}, 200, "ease");
            footerHeading.swipe("enable");
            $("main").transition({paddingBottom: footerHeight, marginBottom: "-" + footerHeight}, 200, "ease");
        } else {
            // desktop
            footerHeading.swipe("disable");
            channel = "desktop";
            footer.css({
                height: "100%",
                width: "0%"
            });
            $("section.max_map").transition({width: "80%"}, 200, "ease");
            footer.transition({width: "20%"}, 200, "ease");
        }
    } else {
        userLocation.currentInfobox.close();
    }

    userLocation.currentInfobox = location.infobox;
    location.infobox.open(userLocation.map, location.marker);
}

function closeEntry() {
    var footer = $("section#article-section");

    if (channel === "mobile") {
        // mobile
        footer.transition({height: 0}, 200, "ease");
        $("main").transition({paddingBottom: "0px", marginBottom: "0px"}, 200, "ease" , function() {
            footer.css("padding", "0rem");
        });
    } else {
        // desktop
        footer.transition({width: "0%"}, 200, "ease", function() {
            footer.css({
                height: "100%",
                padding: "0rem",
                width: "auto"
            });
        });
        $("section.max_map").transition({width: "100%"}, 200, "ease");
    }

    if (userLocation.currentInfobox !== null) {
        userLocation.currentInfobox.close();
        userLocation.currentInfobox = null;
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
    google.maps.event.addListener(userLocation.map, 'click', closeEntry);
}