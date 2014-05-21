/**
 * Created by jpi on 08.05.14.
 */

var geocoder = new google.maps.Geocoder();

/**
 * Utility function that provides google addresses
 * to a certain location given by latitude and longitude.
 * @param latitude
 * @param longitude
 * @param callback the Callback to be called, when the addresses have been retrieved
 *        will be given an array of addresses and locations
 */
function getNearbyAddresses(latitude, longitude, callback) {
    var latLng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode({
        location: latLng
    }, function(result, status) {
        var results = [];
        if (status === google.maps.GeocoderStatus.OK) {
            for (var i = 0; i < result.length; i++) {
                var singleResult = {
                    address: result[i].formatted_address,
                    latitude: result[i].geometry.location.lat(),
                    longitude: result[i].geometry.location.lng()
                }
                results[results.length] = singleResult;
            }
        }
        callback(results);
    });
}

/**
 * Utility function that provides google places
 * search to a certain location.
 * @param map
 * @param latitude
 * @param longitude
 * @param callback
 */
function getNearbyPlaces(map, latitude, longitude, callback) {
    var places = new google.maps.places.PlacesService(map);

    places.search({
        location: new google.maps.LatLng(latitude, longitude),
        radius: '500'
    }, function(result, status) {
        var results = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < result.length; i++) {
                var singleResult = {
                    address: result[i].formatted_address,
                    latitude: result[i].geometry.location.lat(),
                    longitude: result[i].geometry.location.lng()
                }
                results[results.length] = singleResult;
            }
        }
        callback(results);
    })
}