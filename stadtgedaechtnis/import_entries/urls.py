__author__ = 'jpi'

from django.conf.urls import patterns, url

from stadtgedaechtnis.import_entries.views import *

simple_json = SimpleJSONImport("", True, "/admin/")

urlpatterns = patterns('',
    url(r'^simple-json/', simple_json.import_entries))