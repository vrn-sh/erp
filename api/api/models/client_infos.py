from django.db import models
from django.utils.translation import gettext_lazy as _
from .mission import Mission


class ClientInfo(models.Model):
    mission = models.OneToOneField(Mission, on_delete=models.CASCADE, related_name='client_info')
    company_name = models.CharField(_('company name'), max_length=255)
    creation_date = models.DateField(_('creation date'))
    nb_employees = models.IntegerField(_('number of employees'))
    occupation = models.CharField(_('occupation'), max_length=255)
    legal_entity = models.CharField(_('legal entity'), max_length=255)
    brief_description = models.TextField(_('brief description'))

    class Meta:
        verbose_name = _('client info')
        verbose_name_plural = _('client info')

    REQUIRED_FIELDS = ['company_name', 'creation_date', 'nb_employees', 'occupation', 'legal_entity', 'brief_description']

    def __str__(self):
        return self.company_name
