__author__ = 'jpi'

from django.views.generic import View
from django.http import HttpResponse


class GetNearbyPlacesDBPedia(View):

    def get(self, request, *args, **kwargs):
        lat, lon = float(kwargs["lat"]), float(kwargs["lon"])
        min_lat, max_lat = lat - 0.1, lat + 0.1
        min_lon, max_lon = lon - 0.1, lon + 0.1

        result = ""
        return HttpResponse(result,
                            content_type="application/json")


