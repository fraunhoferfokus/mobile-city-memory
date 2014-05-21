"""
Created on 26.02.2014

@author: jpi
"""

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView
from stadtgedaechtnis.views import EntryView

urlpatterns = patterns('',
                       url(r'^services/', include('stadtgedaechtnis.services.urls')),
                       )