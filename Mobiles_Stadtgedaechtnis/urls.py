from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^test/', include('polls.urls', namespace="polls")),
    url(r'^stadtgedaechtnis', include('stadtgedaechtnis.urls', namespace="stadtgedaechtnis")),
    url(r'^admin/', include(admin.site.urls)),
)
