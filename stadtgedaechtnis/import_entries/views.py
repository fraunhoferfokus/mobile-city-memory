from abc import ABCMeta, abstractmethod
import urllib2
import json
import time

from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden
from django.core.urlresolvers import reverse
from django.views.generic import TemplateView

from stadtgedaechtnis.utils import replace_multiple
from stadtgedaechtnis.models import Location, Entry, EntryType


__author__ = 'jpi'


class ImportView(TemplateView):
    """
    Abstract class to import entries from various sources.
    """

    __metaclass__ = ABCMeta
    interactive = False
    source = ""
    redirect = False
    redirect_to = ""

    @abstractmethod
    def do_import(self):
        """
        Does the actual import. Abstract method to be implemented in subclasses.
        """
        pass

    def get(self, request, *args, **kwargs):
        """
        Returns a HttpResponse after importing the entries.
        Only allows requests from localhost.
        """
        request_host = request.get_host()
        if self.interactive or request_host.startswith("localhost") or request_host.startswith("127.0.0.1"):
            # Interactive requests can be from any host.
            # This site is viewed as an admin site.
            self.do_import()

            if self.redirect:
                response = HttpResponseRedirect(self.redirect_to)
            else:
                response = super(ImportView, self).get(request)

        else:
            response = HttpResponseForbidden()
        return response


class SimpleJSONImport(ImportView):
    """
    Imports entries from the standard JSON file supplied by Digitales Stadtgedaechtnis
    """
    template_name = "admin/import_result.html"
    success_entries = []
    failed_entries = []
    exist_entries = []

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(SimpleJSONImport, self).get_context_data(**kwargs)
        # Add succeeded and failed imports
        context['success_import'] = self.success_entries
        context['fail_import'] = self.failed_entries
        context['exist_import'] = self.exist_entries
        return context

    def do_import(self):
        self.success_entries = []
        self.failed_entries = []
        response = urllib2.urlopen(self.source)
        result = response.read()
        dictionary = {
            "id:": "\"id\":",
            "isDuration:": "\"isDuration\":",
            "type:": "\"type\":",
            "addressLatLng:": "\"addressLatLng\":",
            "typename:": "\"typename\":",
            "created:": "\"created\":",
            "label:": "\"label\":",
            "preview:": "\"preview\":",
            "pic:": "\"pic\":",
            "pic_text:": "\"pic_text\":",
            "timeStart:": "\"timeStart\":",
            "author:": "\"author\":",
            "www:": "\"www\":",
            "details:": "\"details\":",
            "timeEnd:": "\"timeEnd\":",
            "nr:": "\"nr\":",
            "age:": "\"age\":",
            "types:": "\"types\":",
            "pluralLabel:": "\"pluralLabel\":",
            "properties:": "\"properties\":",
            "valueType:": "\"valueType\":",
            "	": "",
            ",\r\n,": ",\r\n",
        }
        # make the JSON valid
        result = replace_multiple(result, dictionary)
        json_result = json.loads(result)
        # select all the items
        items = json_result["items"]
        # filter for all the locations
        location_items = filter(lambda entry: "id" in entry, items)
        story_items = filter(lambda entry: "label" in entry, items)
        # iterate over all the located stories
        for location in location_items:
            lat, lon = location["addressLatLng"].split(",")
            lat, lon = round(float(lat), 10), round(float(lon), 10)
            label = location["id"]
            try:
                location_object = Location.objects.get(latitude=lat, longitude=lon)
                # find the story
                story = filter(lambda entry: entry["label"] == label, story_items)[0]
                # only insert story if story does not exist so far
                if not Entry.objects.filter(title=label).exists():
                    entry = Entry()
                    entry.title = label
                    entry.location = location_object
                    entry.author = story["author"]
                    entry.abstract = story["preview"]
                    if "timeStart" in story:
                        entry.time_start = story["timeStart"]
                    else:
                        entry.time_start = time.strftime(
                            "%Y-%m-%d",
                            time.strptime(story["created"], "%d.%m.%Y %H:%M:%S"))
                    if "timeEnd" in story:
                        entry.time_end = story["timeEnd"]
                    entry.type = EntryType.objects.get(label=story["typename"])
                    # TODO: add more infos
                    entry.save()
                    # Add entry to succeeded entry list
                    self.success_entries.append(entry)
                else:
                    entry = dict()
                    entry["title"] = label
                    entry["location"] = location_object
                    self.exist_entries.append(entry)

            except Location.DoesNotExist:
                location["lat"] = str(lat)
                location["lon"] = str(lon)
                location["url"] = reverse('admin:stadtgedaechtnis_location_add') + \
                    "?latitude=" + str(lat) + "&longitude=" + str(lon)
                self.failed_entries.append(location)


