__author__ = 'jpi'

from django.conf.urls import patterns, url

from stadtgedaechtnis.services.views import *
from stadtgedaechtnis.import_entries.views import ImportEntry


urlpatterns = patterns('',
    # TODO: add a mixin for localhost access only
    url(r'^get-nearby-places/(?P<lat>\d{1,3}\.\d{1,10})/(?P<lon>\d{1,3}\.\d{1,10})/$', GetNearbyPlacesDBPedia.as_view(),
        name="get-nearby-places"),
    url(r'^get-nearby-locations/(?P<lat>\d{1,3}\.\d{1,10})/(?P<lon>\d{1,3}\.\d{1,10})/$', GetNearbyLocations.as_view(),
        name="get-nearby-locations"),
    url(r'^get-nearby-locations/(?P<lat>\d{1,3}\.\d{1,10})/(?P<maxlat>\d{1,3}\.\d{1,10})/'
        '(?P<lon>\d{1,3}\.\d{1,10})/(?P<maxlon>\d{1,3}\.\d{1,10})/$', GetNearbyLocations.as_view(),
        name="get-nearby-locations"),
    url(r'^import-entry/(?P<id>\d+)/(?P<location>\d+)/$', ImportEntry.as_view(),
        name="import-entry")
    )