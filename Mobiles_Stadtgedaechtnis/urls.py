from django.conf.urls import patterns, include, url

import stadtgedaechtnis.admin
import settings

js_info_dict = {
    'packages': ('stadtgedaechtnis',),
}

urlpatterns = patterns('',
    url(r'^', include('stadtgedaechtnis.urls', namespace="stadtgedaechtnis")),
    url(r'^', include('stadtgedaechtnis_frontend.urls', namespace="stadtgedaechtnis_frontend")),
    url(r'^admin/', include(stadtgedaechtnis.admin.site.urls)),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^jsi18n/', 'django.views.i18n.javascript_catalog', js_info_dict),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, }),
    )
