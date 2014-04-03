from django.contrib import admin
from django.conf.urls import patterns, url, include

from stadtgedaechtnis.models import *


class StadtgedaechtnisAdmin(admin.AdminSite):
    """
    Custom administration site for Stadtgedaechtnis.
    Provides views for importing entries and other maintenance tasks.
    """

    def get_urls(self):
        urls = super(StadtgedaechtnisAdmin, self).get_urls()
        my_urls = patterns('',
                           url(r'^import/', include('stadtgedaechtnis.import_entries.urls'))
                           )
        return my_urls + urls

admin.site = StadtgedaechtnisAdmin()
admin.autodiscover()

site = admin.site

site.register(Entry)
site.register(Location)
site.register(EntryType)
site.register(MediaObject)
site.register(MediaSource)
