__author__ = 'jpi'

from django.views.generic import View
from django.http import HttpResponse
from SPARQLWrapper import SPARQLWrapper, JSON

import json


class GetNearbyPlacesDBPedia(View):

    def get(self, request, *args, **kwargs):
        lat, lon = float(kwargs["lat"]), float(kwargs["lon"])
        min_lat, max_lat = lat - 0.01, lat + 0.01
        min_lon, max_lon = lon - 0.01, lon + 0.01

        sparql = SPARQLWrapper("http://dbpedia.org/sparql")
        sparql.setQuery("select distinct ?link, ?name where "
        	"{?link geo:lat ?latitude . ?link geo:long ?longitude . ?link foaf:name ?name "
        	"filter (xsd:decimal(?latitude) >= " + str(min_lat)  + ") "
        	"filter (xsd:decimal(?latitude) <= " + str(max_lat) + ") "
        	"filter (xsd:decimal(?longitude) >= " + str(min_lon) + ") "
        	"filter (xsd:decimal(?longitude) <= " + str(max_lon) + ")}")
        sparql.setReturnFormat(JSON)
        places = sparql.query().convert()

        result = {"entries":[]}

        for place in places["results"]["bindings"]:
    		result["entries"].append({"name": place["name"]["value"], "url": place["link"]["value"]})

        return HttpResponse(json.dumps(result),
                            content_type="application/json")


