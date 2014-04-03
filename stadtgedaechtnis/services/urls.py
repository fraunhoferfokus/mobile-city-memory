__author__ = 'jpi'

from django.conf.urls import patterns, url

from stadtgedaechtnis.services.views import *


urlpatterns = patterns('',
    # TODO: add a mixin for localhost access only
    # TODO: add parameters
    url(r'^get-nearby-places/$', GetNearbyPlacesDBPedia.as_view(), name="get-nearby-places"),
    )