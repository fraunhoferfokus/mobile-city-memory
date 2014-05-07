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
 * @param index index of entry for this infobox
 */
function createInfobox(location) {
    if (location.entries.length > 1) {
        var infoBoxContent = "<div class='infowindow'><ul>";
        for (var i = 0; i < location.entries.length; i++) {
            infoBoxContent += "<li><a href='#' class='switch-entry' data-entry='" + i + "'>" + location.entries[i].title + "</a></li>";
        }
        infoBoxContent += "</ul></div>";
    } else {
        var infoBoxContent = "<div class='infowindow'><p>" + location.entries[0].abstract + "</p></div>";
    }

    var infoBox = new google.maps.InfoWindow({
        content: infoBoxContent,
        maxWidth: 225
    })

    location.infobox = infoBox;
    google.maps.event.clearListeners(location.marker, 'click');
    google.maps.event.addListener(location.marker, 'click', function () {
        openEntry(location);
    });
    google.maps.event.addListener(infoBox, 'closeclick', closeEntry);
}

/**
 * Loads the complete entry for the given location and entry index.
 * @param location
 * @param index
 */
function loadAdditionalEntry(listElement) {
    if (!listElement.data("loaded")) {
        var index = listElement.data("entry");
        var id = listElement.data("id");

        $("article#entry-more-" + index).html("");
        $("img#load-more-" + index).show();
        $.get("../stadtgedaechtnis/entry/" + id + "/", function (data) {
            console.log($("article#entry-more-" + index));
            $("article#entry-more-" + index).html(data);
            $("img#load-more-" + index).hide();
            listElement.data("loaded", true);
        });
    }
}

/**
 * Opens an infobox for the first entry in this
 * location and pops up the pop up with the
 * correct heading and image. Handles click
 * events on the marker.
 * @param entry
 */
function openEntry(location) {
    var entryList = "";
    for (var i = 0; i < location.entries.length; i++) {
        // create list of entrys for slider
        entryList += '<li data-entry="' + i + '" data-id="' + location.entries[i].id + '">\
                        <div class="article-heading">\
                            <div class="article-heading-row">\
                                <div class="article-heading-cell entry-slide previous">\
                                    <img src="/static/stadtgedaechtnis/img/left.png">\
                                </div>\
                                <div class="article-heading-cell">\
                                    <h3 id="article-heading-' + i + '">' + location.entries[i].title + '</h3>\
                                </div>\
                                <div class="article-heading-cell entry-slide next">\
                                    <img src="/static/stadtgedaechtnis/img/right.png"></div>\
                                </div>\
                            </div>\
                        </div>';
        if (location.entries[i].image !== undefined) {
            entryList += '<img src="' + location.entries[i].image + '" alt="' + location.entries[i].alt + '" id="entry-first-' + i + '"/>';
        }
        entryList += '<div class="center">\
                            <img src="/static/stadtgedaechtnis/img/ajax-loader.gif" id="load-more-' + i + '" class="load-more">\
                        </div>\
                        <article class="entry-more" id="entry-more-' + i + '">\
                        </article>\
                    </li>';
    }

    $("div.entry-list ul").html(entryList);
    var jQueryEntryList = $("section#article-section div.entry-list");

    if (location.entries.length > 1) {
        // Show next and previous buttons
        $("div.entry-slide").show();
        $("div.entry-slide.previous").unbind("click").click(function() {
                jQueryEntryList.data("unslider").prev();
            });
        $("div.entry-slide.next").unbind("click").click(function() {
                jQueryEntryList.data("unslider").next();
            });
    } else {
        // Hide next and previous buttons
        $("div.entry-slide").hide();
    }

    if (userLocation.currentInfobox === null) {
        // New entry opened
        var footer = $("section#article-section");
        footer.css("padding", "0.8rem 0.8rem 0 0.8rem");

        if ($(window).width() < 768) {
            // mobile
            channel = "mobile";
            jQueryEntryList.data("unslider") && jQueryEntryList.data("unslider").set(0, true);
            footer.transition({height: footerHeight}, 200, "ease");
            initializeSwiping();
            $("main").transition({paddingBottom: footerHeight, marginBottom: "-" + footerHeight}, 200, "ease", function() {
                jQueryEntryList.unslider({
                    complete: loadAdditionalEntry
                });
                jQueryEntryList.data("unslider").set(0, true);
            });
        } else {
            // desktop
            $("div.article-heading").swipe("disable");
            channel = "desktop";
            footer.css({
                height: "100%",
                width: "0%"
            });
            var map = $("section.max_map");
            var map_width = map.width();
            jQueryEntryList.data("unslider") && jQueryEntryList.data("unslider").set(0, true);
            map.transition({width: map_width - 380 + "px"}, 200, "ease");
            footer.transition({width: "380px"}, 200, "ease", function() {
                jQueryEntryList.unslider({
                    complete: loadAdditionalEntry
                });
                jQueryEntryList.data("unslider").set(0, true);
            });
            $("div.entry-list ul li").css("overflow-y", "auto");
        }
    } else {
        // Old entry already opened
        jQueryEntryList.data("unslider").set(0, true);
        userLocation.currentInfobox.close();
        jQueryEntryList.unslider({
            complete: loadAdditionalEntry
        });
    }

    loadAdditionalEntry($("div.entry-list ul li:first"));

    userLocation.currentInfobox = location.infobox;
    location.infobox.open(userLocation.map, location.marker);

    if (location.entries.length > 1) {
        $("a.switch-entry").each(function() {
            $(this).click(function() {
                var entryIndex = $(this).data("entry");
                jQueryEntryList.data("unslider").move(entryIndex);
            });
        });
    }
}

function closeEntry() {
    var footer = $("section#article-section");

    if (channel === "mobile") {
        // mobile
        footer.transition({height: 0}, 200, "ease");
        $("main").transition({paddingBottom: "0px", marginBottom: "0px"}, 200, "ease" , function() {
            footer.css("padding", "0rem");
            $("div.entry-list ul").removeAttr("style");
        });
    } else {
        // desktop
        footer.transition({width: "0%"}, 200, "ease", function() {
            footer.css({
                height: "100%",
                padding: "0rem",
                width: "auto"
            });
            $("div.entry-list ul").removeAttr("style")
        });
        $("section.max_map").transition({width: "100%"}, 200, "ease");
        //footer.css("overflow-y", "hidden");
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