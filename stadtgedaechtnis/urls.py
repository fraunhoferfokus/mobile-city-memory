"""
Created on 26.02.2014

@author: jpi
"""

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from stadtgedaechtnis.views import EntryView

urlpatterns = patterns('',
                       url(r'^$', TemplateView.as_view(template_name='stadtgedaechtnis/index.html')),
                       url(r'^i18n/', include('django.conf.urls.i18n')),
                       url(r'^services/', include('stadtgedaechtnis.services.urls')),
                       url(r'^entry/(?P<pk>\d+)/$', EntryView.as_view()),
                       )