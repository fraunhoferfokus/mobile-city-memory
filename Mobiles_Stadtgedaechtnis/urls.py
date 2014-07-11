from django.conf.urls import patterns, include, url

import stadtgedaechtnis_backend.admin
import settings
from thread import start_new_thread

js_info_dict = {
    'packages': ('stadtgedaechtnis_backend',),
}

urlpatterns = patterns(
    '',
    url(r'^', include('stadtgedaechtnis_backend.urls', namespace="stadtgedaechtnis_backend")),
    url(r'^', include('stadtgedaechtnis_frontend.urls', namespace="stadtgedaechtnis_frontend")),
    url(r'^admin/', include(stadtgedaechtnis_backend.admin.site.urls)),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT, }),
)


def run_cronjobs():
    """
    Runs the cronjobs. Needs to be called in a seperate thread or the main thread will be blocked.
    :return:
    """
    import schedule
    import time
    from stadtgedaechtnis_backend.import_entries.importers import do_silent_json_import
    from stadtgedaechtnis_backend.import_entries.urls import JSON_URL

    schedule.every().day.at("23:00").do(do_silent_json_import, JSON_URL)

    while True:
        schedule.run_pending()
        time.sleep(1)

start_new_thread(run_cronjobs, ())
