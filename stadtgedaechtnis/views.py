__author__ = 'jpi'

from django.views.generic.detail import DetailView
from stadtgedaechtnis.models import Entry


class EntryView(DetailView):

    template_name = "stadtgedaechtnis/entry.html"
    model = Entry
