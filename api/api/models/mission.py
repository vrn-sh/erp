"""This module manages generic models required for missions"""

from datetime import datetime, timedelta
from os import environ
from typing import List, Optional
from django.db import models
from django.contrib.postgres.fields import ArrayField

from api.models import Auth, MAX_TITLE_LENGTH, Team
from api.models.utils import NmapPortField
from api.services.s3 import create_bucket


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


class NmapScan(models.Model):
    """
        Nmap scan

        parses output of nmap scan and stores it into database
    """

    class Meta:
        verbose_name = 'Nmap data'
        verbose_name_plural = 'Nmap data'
        ordering = ['id']

    REQUIRED_FIELDS = ['recon', 'ips', 'ports']

    recon: Recon = models.ForeignKey(Recon, on_delete=models.CASCADE)
    creation_timestamp: models.DateTimeField = models.DateTimeField(editable=False, auto_now=True)

    ips: List[models.CharField] = ArrayField(models.CharField(max_length=32))
    ports: List[NmapPortField] = ArrayField(NmapPortField())


class Mission(models.Model):
    """Mission model"""

    class Meta:
        verbose_name = "Mission"
        verbose_name_plural = "Missions"
        ordering = ['start']

    REQUIRED_FIELDS = ['start', 'end', 'team', 'created_by']

    start = models.DateField()
    end = models.DateField()

    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    created_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='created_by')

    last_updated_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_updated_by')
    title = models.CharField(max_length=MAX_TITLE_LENGTH, blank=True, default="Unnamed mission")

    team: Team = models.ForeignKey(Team, on_delete=models.CASCADE)
    recon: Optional[Recon] = models.OneToOneField(Recon, on_delete=models.CASCADE, blank=True, null=True)

    @staticmethod
    def get_delta(start: datetime, end: datetime) -> timedelta:
        return end - start

    @property
    def duration(self) -> float:
        """get the number of days between start and end"""
        return self.get_delta(self.start, self.end).days

    def days_left(self) -> float:
        """get number of days left in this mission"""
        return self.get_delta(datetime.today(), self.end).days

    @property
    def bucket_name(self) -> str:
        return self.title.replace(' ', '_')

    def save(self, *args, **kwargs):
        if self.pk is None and environ.get('PRODUCTION', '0') == '1':
            create_bucket(self.bucket_name)
        super().save(*args, **kwargs)
