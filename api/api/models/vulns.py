from typing import List, Optional
from django.db import models
from django.db.models import ImageField

from api.models import Pentester, Auth

from api.models import NAME_LENGTH, MAX_NOTE_LENGTH
from api.models.mission import Mission


class Notes(models.Model):
    """
        In order to give pentesters flexibility in their
        work, we should let them save simple notes about the
        current infrastructure.
    """

    REQUIRED_FIELDS = ["content", "author", "mission"]

    mission: Mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
    content: models.TextField = models.TextField(max_length=MAX_NOTE_LENGTH)

    creation_date: models.DateField = models.DateField(auto_now=True, editable=False)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    author: Optional[Auth] = models.ForeignKey(Auth, on_delete=models.CASCADE, blank=True, null=True)


class ImageModel(models.Model):
    class Meta:
        verbose_name = 'Image'
        verbose_name_plural = 'Images'
        ordering = ['id']

    image = ImageField(name='image')  # FIXME(adina): add storage, STATIC_FILES path in settings, setup nginx



class VulnType(models.Model):
    class Meta:
        verbose_name = 'Vulnerability TYPE Model'
        verbose_name_plural = 'Vulnerability TYPES models'
        ordering = ['name']

    name = models.CharField(max_length=NAME_LENGTH, primary_key=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f'<VulnType: \'{self.name}\'>'


class Vulnerability(models.Model):
    class Meta:
        verbose_name = 'Vulnerability Model'
        verbose_name_plural = 'Vulnerability models'
        ordering = ['creation_date', 'serverity']

    title = models.CharField(max_length=NAME_LENGTH)
    description = models.TextField(max_length=MAX_NOTE_LENGTH, blank=True)
    serverity = models.FloatField()

    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)

    author: Optional[Auth] = models.ForeignKey(
        Auth, on_delete=models.CASCADE, related_name='author', blank=True, null=True)
    last_editor: Auth = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_editor')

    vuln_type: VulnType = models.OneToOneField(VulnType, on_delete=models.CASCADE, blank=True)
    images: List[ImageModel] = models.ManyToManyField(ImageModel, blank=True, default=None)
