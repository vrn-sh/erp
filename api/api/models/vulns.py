from django.db import models
from django.db.models import ImageField

from api.models import Pentester

MAX_NOTE_LENGTH = 8186
MAX_LINK_LENGTH = 1024


class Notes(models.Model):
    """
        In order to give pentesters flexibility in their work, we should let them save simple notes about the
        current infrastructure.
    """

    REQUIRED_FIELDS = ["content", "author"]

    # FIXME(adina): add Mission-id (ForeignKey)

    content: models.TextField = models.TextField(max_length=MAX_NOTE_LENGTH)
    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    author: models.ForeignKey = models.ForeignKey(Pentester, on_delete=models.CASCADE)


class ImageModel(models.Model):
    image = ImageField(name='image') # FIXME(adina): add storage, STATIC_FILES path in settings, setup nginx


class VulnType(models.Model):
    name = models.CharField()
    description = models.TextField(blank=True)


class Vulnerability(models.Model):
    title = models.CharField(blank=False)
    description = models.TextField(max_length=MAX_NOTE_LENGTH, blank=True)
    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    author: models.ForeignKey = models.ForeignKey(Pentester, on_delete=models.CASCADE)
    last_editor = models.ForeignKey(Pentester, on_delete=models.CASCADE)
    vuln_type = models.OneToOneField(VulnType, on_delete=models.CASCADE)
    images = models.ManyToManyField(ImageModel)
