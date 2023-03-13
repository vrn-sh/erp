from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import CharField, FloatField, ImageField, TextField

from api.models import Pentester

MAX_NOTE_LENGTH = 8186
MAX_LINK_LENGTH = 1024
NAME_LENGTH=256


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

    class Meta:
        verbose_name = 'Image Model'
        verbose_name_plural = 'Image models'
        ordering = []

    image = ImageField(name='image') # FIXME(adina): add storage, STATIC_FILES path in settings, setup nginx

class VulnType(models.Model):
    """Vulnerability type model (XSS, LFI, etc...)"""

    REQUIRED_FIELDS = ['name', 'description']

    class Meta:
        verbose_name = 'Vulnerability TYPE Model'
        verbose_name_plural = 'Vulnerability TYPES models'
        ordering = ['name']

    name: CharField = models.CharField(max_length=NAME_LENGTH, default='This is a Vulnerability Type')
    description: TextField = models.TextField(blank=True)

class Vulnerability(models.Model):
    """Model representing a vulnerability found by a Pentester"""

    class Meta:
        verbose_name = 'Vulnerability Model'
        verbose_name_plural = 'Vulnerability models'
        ordering = ['creation_date']

    title = models.CharField(max_length=NAME_LENGTH)
    description = models.TextField(max_length=MAX_NOTE_LENGTH, blank=True)
    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    author: models.ForeignKey = models.ForeignKey(Pentester, on_delete=models.CASCADE, related_name='author')
    last_editor = models.ForeignKey(Pentester, on_delete=models.CASCADE, related_name='last_editor')
    vuln_type = models.OneToOneField(VulnType, on_delete=models.CASCADE)
    images = models.ManyToManyField(ImageModel)
    cvss: FloatField = models.FloatField()

    def clean(self) -> None:
        """adding constraint for CVSS field, which should be 0.0 >= cvss <= 10.0"""

        if not 0.0 >= self.cvss <= 10.0:
            raise ValidationError("CVSS should be 0.0 >= cvss <= 10.0")

        return super().clean()
