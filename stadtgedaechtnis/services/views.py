__author__ = 'jpi'

from django.views.generic import View
from django.http import HttpResponse
from SPARQLWrapper import SPARQLWrapper, JSON
from stadtgedaechtnis.models import Entry, Location
from decimal import Decimal

import jsonpickle
import json


class GetNearbyPlacesDBPedia(View):
    """
    Returns a list of places to a given location.
    Parameters: lat - Latitude, lon - Longitude
    A query to DBpedia is made and the results are given in JSON.
    """

    def get(self, request, *args, **kwargs):
        lat, lon = float(kwargs["lat"]), float(kwargs["lon"])
        min_lat, max_lat = lat - 0.01, lat + 0.01
        min_lon, max_lon = lon - 0.01, lon + 0.01

        # build query
        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        sparql.setQuery("select distinct ?link, ?name, ?latitude, ?longitude where "
                        "{?link geo:lat ?latitude . ?link geo:long ?longitude . ?link foaf:name ?name "
                        "filter (xsd:decimal(?latitude) >= " + str(min_lat) + ") "
                        "filter (xsd:decimal(?latitude) <= " + str(max_lat) + ") "
                        "filter (xsd:decimal(?longitude) >= " + str(min_lon) + ") "
                        "filter (xsd:decimal(?longitude) <= " + str(max_lon) + ")}")
        sparql.setReturnFormat(JSON)
        # query DBpedia
        places = sparql.query().convert()

        result = {"entries": []}

        # iterate over results
        for place in places["results"]["bindings"]:
            result["entries"].append({
                "name": place["name"]["value"],
                "url": place["link"]["value"],
                "lat": place["latitude"]["value"],
                "lon": place["longitude"]["value"]
            })

        return HttpResponse(json.dumps(result),
                            content_type="application/json")


class GetNearbyLocations(View):
    """
    Returns a list of locations to given lat and lon coordinates
    Parameters: lat - Latitude, lon - Longitude
    Option: maxlat - Maximum Latitude, maxlon - Maximum Longitude
    """

    def get(self, request, *args, **kwargs):
        lat, lon = Decimal(kwargs["lat"]), Decimal(kwargs["lon"])
        if "maxlat" in kwargs and "maxlon" in kwargs:
            min_lat, max_lat = lat, Decimal(kwargs["maxlat"])
            min_lon, max_lon = lon, Decimal(kwargs["maxlon"])
        else:
            min_lat, max_lat = lat - 0.01, lat + 0.01
            min_lon, max_lon = lon - 0.01, lon + 0.01

        locations = Location.objects.filter(latitude__gte=min_lat,
                                            latitude__lte=max_lat,
                                            longitude__gte=min_lon,
                                            longitude__lte=max_lon,
                                            entry__isnull=False)

        result = list()
        for location in locations:
            location.entries = list()
            # supply all the entries from the location
            for entry in location.entry_set.all():
                if entry.mediaobject_set.count > 0:
                    # set first image url and alt for entry
                    media_object = entry.mediaobject_set.first()
                    if media_object is not None:
                        entry.image = media_object.mediasource_set.first().file.url
                        entry.alt = media_object.alt
                location.entries.append(entry)

            result.append(location)

        return HttpResponse(jsonpickle.encode(result, unpicklable=False, max_depth=5),
                            content_type="application/json")
