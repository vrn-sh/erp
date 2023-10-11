import warnings
from datetime import date

from django.db import models

from api.models.mission import Mission

from api.models import Team
from api.models.report.generate_html import generate_vulns_detail, generate_members


class ReportTemplate(models.Model):
    class Meta:
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'

    REQUIRED_FIELDS = []
    name = models.CharField(max_length=25)
    css_style = models.TextField()
    cover_html = models.TextField()


class ReportHtml(models.Model):
    class Meta:
        verbose_name = 'Report Html'
        verbose_name_plural = 'Reports Html'

    REQUIRED_FIELDS = []

    template = models.ForeignKey(to=ReportTemplate, on_delete=models.CASCADE, related_name='template_id',
                                 blank=True, default=None)
    mission = models.ForeignKey(to=Mission, on_delete=models.CASCADE, related_name='mission_id')
    version = models.FloatField(default=1.0)
    logo = models.CharField(max_length=255, blank=True, null=True)
    html_file = models.CharField(max_length=255, blank=True, null=True)


