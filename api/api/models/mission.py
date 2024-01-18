"""This module manages generic models required for missions"""

from datetime import datetime, timedelta, date
from os import environ
import os
from typing import Optional
from django.db import models
from django.core.cache import cache
from django.contrib.postgres.fields import ArrayField

from api.models import Auth, MAX_TITLE_LENGTH, Freelancer, Team
from api.models.utils import NmapPortField
from api.services.s3 import S3Bucket

import uuid


SCOPE_LENGTH = 128

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


class CrtSh(models.Model):
    """
        Model responsible for reading crt.sh API results
    """

    class Meta:
        verbose_name = 'crt.sh'
        ordering = ['id']

    REQUIRED_FIELDS = ['dump', 'recon']

    dump = models.TextField()
    recon = models.ForeignKey(Recon, on_delete=models.CASCADE, related_name='crtsh_runs')


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

    recon = models.ForeignKey(Recon, on_delete=models.CASCADE, related_name='nmap_runs')
    creation_timestamp: models.DateTimeField = models.DateTimeField(editable=False, auto_now=True)

    ips = ArrayField(models.CharField(max_length=32))
    ports = ArrayField(NmapPortField())
    os_details = models.CharField(max_length=64, null=True, blank=True)

    nmap_version = models.CharField(max_length=32, null=True, blank=True)
    scan_date = models.CharField(max_length=32, null=True, blank=True)


class Mission(models.Model):
    """Mission model"""

    class Meta:
        verbose_name = "Mission"
        verbose_name_plural = "Missions"
        ordering = ['last_updated_by']

    REQUIRED_FIELDS = ['start', 'end', 'team', 'created_by', 'scope']

    start = models.DateField()
    end = models.DateField()

    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
    created_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='created_missions')

    last_updated_by = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='last_updated_missions')
    title = models.CharField(max_length=MAX_TITLE_LENGTH, blank=True, default="Unnamed mission")
    description = models.TextField(blank=True, null=True, default="")
    logo: Optional[models.CharField] = models.CharField(max_length=38, null=True, blank=True)

    freelance_member = models.ForeignKey(Auth, on_delete=models.CASCADE, related_name='missions', null=True, blank=True)

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='member_of', blank=True, null=True)
    recon = models.OneToOneField(Recon, on_delete=models.CASCADE, blank=True, null=True, related_name='mission')

    scope = ArrayField(models.CharField(max_length=SCOPE_LENGTH), max_length=64, null=True, blank=True)

    bucket_name: Optional[models.CharField] = models.CharField(max_length=48, null=True, blank=True)

    @staticmethod
    def get_delta(start: datetime, end: datetime) -> timedelta:
        return end - start

    @property
    def duration(self) -> float:
        """get the number of days between start and end"""
        return self.get_delta(self.start, self.end).days  # type: ignore

    @property
    def days_left(self) -> float:
        """get number of days left in this mission"""
        return self.get_delta(datetime.today(), self.end).days  # type: ignore

    @property
    def status(self) -> str:
        """Obtain the mission status"""
        today = date.today()
        if self.start <= today <= self.end:
            return "In progress"
        else:
            return "Succeeded"

    def is_member(self, user: Auth) -> bool:
        """checks if a user is a member of the mission"""
        if self.freelance_member:
            return user.id == self.freelance_member.id  # type: ignore

        return self.team.is_member(user)  # type: ignore


    def save(self, *args, **kwargs):

        if self.pk is None:
            self.recon = Recon.objects.create()  # type: ignore
            self.bucket_name = uuid.uuid4().hex  # type: ignore

            if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                return super().save(*args, **kwargs)

            if environ.get('IN_CONTAINER', '0') == '1':
                S3Bucket().create_bucket(self.bucket_name)

        else:
            if '1' not in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                cache.delete(f'mission_{self.pk}')  # type: ignore
        return super().save(*args, **kwargs)


class Credentials(models.Model):
    """
        Model storing the information to be found in /credentials page
    """

    REQUIRED_FIELDS = ['login', 'mission', 'password', 'service']

    class Meta:
        ordering = ['service']
        verbose_name = ['Credentials']

    login: models.CharField = models.CharField(max_length=128)
    password: models.CharField = models.CharField(max_length=128)
    service: models.CharField = models.CharField(max_length=128)
    comment: models.CharField = models.CharField(max_length=128, blank=True, null=True)
    mission: models.ForeignKey = models.ForeignKey("api.Mission", on_delete=models.CASCADE, blank=True, null=True, related_name='creds')
