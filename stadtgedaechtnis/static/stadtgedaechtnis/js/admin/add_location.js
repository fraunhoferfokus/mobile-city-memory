/**
 * Created by jpi on 07.04.14.
 */

var map;

function replace_locations(data) {
    $("table#locations tr.entry").remove();
    $("img#loading").css("visibility", "hidden");

    for (var i = 0; i < data.entries.length; i++) {
        var location = data.entries[i];
        var new_row = $('<tr>').appendTo('table#locations').addClass("entry");
        $('<td>').appendTo(new_row).text(location.name + " (" + location.lat + ", " + location.lon + ")");
        var cell = $('<td>').appendTo(new_row);
        $('<a>').appendTo(cell).attr({href: location.url, target: '_blank'}).text(location.url);
        cell = $('<td>').appendTo(new_row);
        $('<a>').appendTo(cell).attr({
            href: "#",
            onClick: "add_link(\"" + location.url +"\")"
        }).text(gettext("Auswählen"));

        var infowindow = new google.maps.InfoWindow({
            content: location.name
        });

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.lat, location.lon),
            map: map,
            title: location.name
        });

        google.maps.event.addListener(marker, "click", function() {
            infowindow.open(map, marker);
        });
    }
}

function search_locations() {
    $("img#loading").css("visibility", "visible");
    $("div#map_canvas").css("visibility", "visible");

    var lat = $("#id_latitude").val();
    var lon = $("#id_longitude").val();

    var position = new google.maps.LatLng(lat, lon);
    map.panTo(position);

    new google.maps.Marker({
            position: position,
            map: map,
            icon: "http://maps.gstatic.com/mapfiles/markers2/icon_green.png",
            title: gettext("Aktueller Ort")
        });

    $.get("../../../../stadtgedaechtnis/services/get-nearby-places/" + lat + "/" + lon + "/").done(replace_locations);
}

function add_link(url) {
    $("#id_dbpedia_link").val(url);
}

function initialize_map() {
    var mapOptions = {
        center: new google.maps.LatLng(50.258, 10.965),
        zoom: 14
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

$(function() {
    initialize_map();
});