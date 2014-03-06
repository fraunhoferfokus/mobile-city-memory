'''
Created on 26.02.2014

@author: jpi
'''

from django.utils.translation import ugettext as _
from django.db import models


class ItemWithMedia(models.Model):
    """
    Superclass to distinguish between the different media-using objects
    """
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modified = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __unicode__(self):
        try:
            return self.EntryType.__unicode__(self)
        except AttributeError:
            try:
                return self.Location.__unicode__(self)
            except AttributeError:
                return self.Entry.__unicode__(self)


class EntryType(ItemWithMedia):
    """
    List of types a new entry can be
    """
    label = models.CharField(max_length=25)

    def __unicode__(self):
        return self.label


class Location(ItemWithMedia):
    """
    A Location with a geoposition
    """
    label = models.CharField(max_length=150)
    latitude = models.DecimalField(decimal_places=3, max_digits=10)
    longitude = models.DecimalField(decimal_places=3, max_digits=10)

    def __unicode__(self):
        return self.label + " (" + str(self.latitude) + ", " + str(self.longitude) + ")"


class Entry(ItemWithMedia):
    """
    One entry
    """
    type = models.ForeignKey(EntryType, on_delete=models.PROTECT)
    title = models.CharField(max_length=150)
    abstract = models.TextField()
    text = models.TextField(null=True, blank=True)
    author = models.CharField(max_length=150)
    time_start = models.DateField()
    time_end = models.DateField(null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.PROTECT)

    def __unicode__(self):
        return self.title + " (" + self.author + ")"


class MediaObject(models.Model):
    """
    Media Object to save images, videos or audio files that belong to an entry,
    a location or an entry type
    """
    VIDEO = "vid"
    IMAGE = "img"
    SOUND = "aud"
    MEDIA_TYPES = (
        (VIDEO, _("Video")),
        (IMAGE, _("Bild")),
        (SOUND, _("Audio")),
    )
    entry = models.ForeignKey(ItemWithMedia)
    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modified = models.DateTimeField(auto_now=True, null=True, blank=True)
    type = models.CharField(max_length=3, choices=MEDIA_TYPES, default=IMAGE)
    alt = models.CharField(max_length=300)

    def __unicode__(self):
        return self.alt


class MediaSource(models.Model):
    """
    One Source file that belongs to a media object
    """
    def get_upload_path(instance, filename):
        return "/entries/" + instance.entry.id + filename

    get_upload_path = staticmethod(get_upload_path)

    created = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    modified = models.DateTimeField(auto_now=True, null=True, blank=True)
    media_object = models.ForeignKey(MediaObject)
    file = models.FileField(upload_to=get_upload_path)

    def __unicode__(self):
        return self.file.file