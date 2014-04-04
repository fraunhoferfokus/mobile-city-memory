__author__ = 'jpi'

from django.conf.urls import patterns, url

from stadtgedaechtnis.services.views import *


urlpatterns = patterns('',
    # TODO: add a mixin for localhost access only
    url(r'^get-nearby-places/(?P<lat>\d{1,3}\.\d{1,10})/(?P<lon>\d{1,3}\.\d{1,10})/$', GetNearbyPlacesDBPedia.as_view(),
        name="get-nearby-places"),
    )