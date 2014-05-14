__author__ = 'jpi'

import re
from stadtgedaechtnis.models import Location


def replace_multiple(text, dictionary):
    """
    Replaces different words in a string using a dictionary.
    """
    # escape for regular expressions
    dictionary = dict((re.escape(key), value) for key, value in dictionary.iteritems())
    # compile joint pattern
    pattern = re.compile("|".join(dictionary.keys()))
    # replace all the keys with the values
    text = pattern.sub(lambda m: dictionary[re.escape(m.group(0))], text)
    return text


def get_nearby_locations(lat, lon, max_lat=0, max_lon=0):
    """
    Gets near Locations to given geolocations
    """
    if max_lat == 0:
        min_lat, max_lat = lat - 0.01, lat + 0.01
    else:
        min_lat = lat

    if max_lon == 0:
        min_lon, max_lon = lon - 0.01, lon + 0.01
    else:
        min_lon = lon

    locations = Location.objects.filter(latitude__gte=min_lat,
                                        latitude__lte=max_lat,
                                        longitude__gte=min_lon,
                                        longitude__lte=max_lon,)

    return locations
