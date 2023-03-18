"""This module manages generic models required for missions

The following models are present here:

    - Auth: Mission
"""
from django.db import models

from api.models import Auth, MAX_TITLE_LENGTH


# TODO: add a Team one model will be available
# Create role Manager ??
class Mission(models.Model):

    class Meta:
        verbose_name = "Mission Model"
        verbose_name_plural = "Mission models"
        ordering = ['start']

    REQUIRED_FIELDS = ['duration', 'start', 'end']

    # Duration is in number of days.
    duration = models.FloatField(default=1)
    start = models.DateField()
    end = models.DateField()
    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    created_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='created_by')
    last_updated_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_updated_by')
    title = models.CharField(max_length=MAX_TITLE_LENGTH, blank=True, default="Unnamed mission")

