__author__ = 'jpi'


from abc import ABCMeta, abstractmethod
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseForbidden


class ImportView:
    """
    Abstract class to import entries from various sources
    """

    __metaclass__ = ABCMeta

    def __init__(self, source, redirect, redirect_to=""):
        self.source = source
        self.redirect = redirect
        self.redirect_to = redirect_to

    @abstractmethod
    def do_import(self):
        """
        Does the actual import
        """
        pass

    def import_entries(self, request):
        """
        Returns a HttpResponse after importing the entries. Only allows requests from localhost
        """
        request_host = request.get_host()
        if request_host.startswith("localhost") or request_host.startswith("127.0.0.1"):
            self.do_import()

            if self.redirect:
                response = HttpResponseRedirect(self.redirect_to)
            else:
                response = HttpResponse()

        else:
            response = HttpResponseForbidden()
        return response


class SimpleJSONImport(ImportView):

    def do_import(self):
        pass