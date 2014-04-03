from django.conf.urls import patterns, include, url

import stadtgedaechtnis.admin

urlpatterns = patterns('',
    url(r'^stadtgedaechtnis/', include('stadtgedaechtnis.urls', namespace="stadtgedaechtnis")),
    url(r'^admin/', include(stadtgedaechtnis.admin.site.urls)),
    url(r'^i18n/', include('django.conf.urls.i18n')),
)
