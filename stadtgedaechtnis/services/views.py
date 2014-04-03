__author__ = 'jpi'

from django.views.generic import View
from django.http import HttpResponse


class GetNearbyPlacesDBPedia(View):

    lat = None
    lon = None

    def get(self, request, *args, **kwargs):
        self.lat
        return HttpResponse("",
                            content_type="application/json")


