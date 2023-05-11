from django.contrib.postgres.fields import ArrayField
from typing import List, Optional
from django.db import models
from django.db.models import FloatField, ImageField, TextField
from rest_framework.serializers import CharField

from api.models import Auth, NAME_LENGTH, MAX_NOTE_LENGTH
from api.models.mission import Mission


def get_bucket_path(instance, filename) -> str:
    return f'{instance.bucket_name}/{instance.title.replace(" ", "_")}/{filename}'

class Notes(models.Model):
    """
        In order to give pentesters flexibility in their
        work, we should let them save simple notes about the
        current infrastructure.
    """

    REQUIRED_FIELDS = ["content", "author", "mission", "title"]

    mission: Mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
    title: models.TextField = models.TextField(default="New note")
    content: models.TextField = models.TextField(max_length=MAX_NOTE_LENGTH)

    creation_date: models.DateField = models.DateField(auto_now=True, editable=False)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    author: Optional[Auth] = models.ForeignKey(Auth, on_delete=models.CASCADE, blank=True, null=True)


class VulnType(models.Model):
    """Vulnerability type model (XSS, LFI, etc...)"""

    REQUIRED_FIELDS = ['name']


    class Meta:
        verbose_name = 'Vulnerability TYPE Model'
        verbose_name_plural = 'Vulnerability TYPES models'
        ordering = ['name']

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=NAME_LENGTH)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f'<VulnType: \'{self.name}\'>'


class Vulnerability(models.Model):
    """Model representing a vulnerability found by a Pentester"""

    REQUIRED_FIELDS = ['title', 'severity', 'author', 'last_editor', 'vuln_type']

    class Meta:
        verbose_name = 'Vulnerability Model'
        verbose_name_plural = 'Vulnerability models'
        ordering = ['title']

    @property
    def bucket_name(self):
        return self.mission.bucket_name

    title = models.CharField(max_length=NAME_LENGTH)
    description = models.TextField(max_length=MAX_NOTE_LENGTH, blank=True)
    severity = models.FloatField()

    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)

    author: Auth = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='author')
    last_editor: Auth = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_editor')

    vuln_type: VulnType = models.ForeignKey(VulnType, on_delete=models.CASCADE)
    images: Optional[List[CharField]] = ArrayField(models.CharField(max_length=32), blank=True, null=True, size=4)

    mission: Mission = models.ForeignKey(Mission, on_delete=models.CASCADE)
