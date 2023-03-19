"""This module manages generic models required for missions

The following models are present here:

    - Auth: Mission
"""
from typing import Optional
from django.db import models

from api.models import Auth, MAX_TITLE_LENGTH, Team


class Recon(models.Model):
    """
        Recon model

        should contain all the third-party integrations for
        all recon services (crt.sh, nmap, etc...)
    """

    class Meta:
        verbose_name = 'Recon data'
        verbose_name_plural = 'Recon data'
        ordering = ['id']

    REQUIRED_FIELDS = []

    updated_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)


class Mission(models.Model):
    """Mission model"""

    class Meta:
        verbose_name = "Mission"
        verbose_name_plural = "Missions"
        ordering = ['start']

    REQUIRED_FIELDS = ['duration', 'start', 'end', 'team']

    # Duration is in number of days.
    duration = models.FloatField()

    start = models.DateField()
    end = models.DateField()

    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    created_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='created_by')

    last_updated_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_updated_by')
    title = models.CharField(max_length=MAX_TITLE_LENGTH, blank=True, default="Unnamed mission")

    team: Team = models.OneToOneField(Team, on_delete=models.CASCADE)
    recon: Optional[Recon] = models.OneToOneField(Recon, on_delete=models.CASCADE, blank=True, null=True)
