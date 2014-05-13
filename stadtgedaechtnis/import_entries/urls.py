__author__ = 'jpi'

from django.conf.urls import patterns, url

from stadtgedaechtnis.import_entries.views import *

from stadtgedaechtnis import admin

urlpatterns = patterns('',
    url(r'^simple-json/$', admin.site.admin_view(SimpleJSONImport.as_view(
            source="http://www.stadtgeschichte-coburg.de/portaldata/1/Resources/_internal/data/json/dsg_coburg.js",
            interactive=True,)),
        name="simple-json"),
    url(r'^simple-json-silent/$', SimpleJSONImport.as_view(
            source="http://www.stadtgeschichte-coburg.de/portaldata/1/Resources/_internal/data/json/dsg_coburg.js",
            interactive=False,
            redirect=True,
            redirect_to="/admin/"),
        name="simple-json-silent"),
)