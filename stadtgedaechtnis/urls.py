'''
Created on 26.02.2014

@author: jpi
'''

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^$'), TemplateView.as_view(
        template_name = "index.html"))
