"""This module manages generic models required for users & authentication

The following models are present here:

    - Auth: Base user login table (stores first_name, last_name, username, email, password, etc...)
    - Pentester: Model storing basic user information
    - Admin: Model used for admins. Can do account creation, overall administration, etc.
"""

import uuid
from logging import info
import os
from typing import List, Optional

from argon2 import PasswordHasher

from phonenumber_field.modelfields import PhoneNumberField

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.core.mail import send_mail, EmailMultiAlternatives
from django.core.cache import cache
from services import sendgrid_mail

MAX_TITLE_LENGTH = 256
MAX_NOTE_LENGTH = 8186
MAX_LINK_LENGTH = 1024
NAME_LENGTH = 256

USER_ROLES = ['unknown', 'pentester', 'manager']


CONFIRM_TOKEN_TIMEOUT_SECONDS = 15 * 60 # 15 minutes
RESETPW_TOKEN_TIMEOUT_SECONDS = 5 * 60  # 5 minutes


class Auth(AbstractUser):
    """
        Auth Model:

            Basic model used to log in users.
            When authenticating users through views, this is the model recovered from the Token

        role: integer containing the current role of the user
        password: hashed password of the user
        phone_number: phone number used for MFA (should use E164 format)
        is_disabled: boolean value checking if user has been locked, or has not confirmed account yet

    """

    class Meta:
        verbose_name = 'Basic user auth model'
        verbose_name_plural = 'Basic user auth models'
        ordering = ['email']

    REQUIRED_FIELDS = ['email', 'password']

    USER_TYPE_CHOICES = (
        (1, 'pentester'),
        (2, 'manager'),
    )

    id: models.AutoField = models.AutoField(primary_key=True)
    role: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, editable=False)
    password: models.CharField = models.CharField(max_length=128)
    phone_number: Optional[PhoneNumberField] = PhoneNumberField(null=True, blank=True)
    email: models.EmailField = models.EmailField(unique=True, null=False, blank=False)
    is_enabled: models.BooleanField = models.BooleanField(default=True)

    def set_password(self, raw_password: str | None = None):
        if not raw_password:
            return
        hashed = PasswordHasher().hash(raw_password)
        self.password = hashed

    def check_password(self, raw_password=None) -> bool:
        return PasswordHasher().verify(self.password, raw_password) if raw_password else False

    def send_confirm_email(self) -> int:
        """sends account-confirmation email"""

        if '1' in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            info(f'Passing send_confirm_email() to {self.email}')
            return 1

        mail = sendgrid_mail.SendgridClient([self.email])
        mail.set_template_data({
            'username': self.first_name,
            'email': self.email,
            'url': f'https://{os.environ["DOMAIN_NAME"]}/confirm?token={tmp_token}'
        })
        mail.set_template_id(os.environ.get('SENDGRID_CONFIRM_TEMPLATE_ID'))

        tmp_token = uuid.uuid4()
        cache.set(f'{self.email};CONFIRM', tmp_token, CONFIRM_TOKEN_TIMEOUT_SECONDS)

        info(f'Sending confirmation email to {self.email}')
        return mail.send()

    def send_reset_password_email(self) -> int:
        """sends password-reset email"""

        if '1' in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            info(f'Passing send_reset_password_email() to {self.email}')
            return 1

        mail = sendgrid_mail.SendgridClient([self.email])
        mail.set_template_data({
            'username': self.first_name,
            'email': self.email,
            'url': f'https://{os.environ["DOMAIN_NAME"]}/reset?token={tmp_token}'
        })
        mail.set_template_id(os.environ.get('SENDGRID_RESET_TEMPLATE_ID'))

        tmp_token = uuid.uuid4()
        cache.set(f'{self.email};RESETPW', tmp_token, RESETPW_TOKEN_TIMEOUT_SECONDS)

        info(f'Sending reset password email to {self.email}')
        return mail.send()

    def save(self, *args, **kwargs) -> None:
        if self.pk is None:
            self.send_confirm_email()
            self.is_enabled = False
        return super().save(*args, **kwargs)


class Manager(models.Model):
    """
        Manager model

        auth -> one-to-one to Auth model
        creation_date -> read-only field expressing creation date

    """
    class Meta:
        verbose_name = 'Manager'
        verbose_name_plural = 'Managers'
        ordering = ['creation_date']

    id: models.AutoField = models.AutoField(primary_key=True)
    auth: Auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date: models.DateField = models.DateField(auto_now=True, editable=False)


class Pentester(models.Model):
    """
        Pentester model

        (Main difference with Manager model is that pentesters cannot own teams)

        auth -> one-to-one to Auth model
        creation_date -> read-only field expressing creation date
    """
    class Meta:
        verbose_name = 'Pentester'
        verbose_name_plural = 'Pentesters'
        ordering = ['creation_date']

    id: models.AutoField = models.AutoField(primary_key=True)
    auth: Auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date: models.DateField = models.DateField(auto_now=True, editable=False)


class Team(models.Model):
    """Model for representing a team of pentester, with one manager"""
    class Meta:
        verbose_name = 'Team'
        verbose_name_plural = 'Teams'
        ordering = ['name']

    REQUIRED_FIELDS = ['name', 'leader', 'members']

    name: models.CharField = models.CharField(max_length=32)
    leader: Manager = models.ForeignKey(Manager, on_delete=CASCADE)
    members: List[Pentester] = models.ManyToManyField(Pentester, blank=True)

    def is_member(self, user) -> bool:
        """check if user is member of the team"""
        return self.leader == user or user in self.members


AuthenticatedUser = Pentester | Manager


def get_user_model(auth: Auth) -> AuthenticatedUser:
    """fetches User model from base authentication model"""

    roles = ['placeholder', 'pentester', 'manager']

    if roles[auth.role] == 'pentester':
        return Pentester.objects.get(auth_id=auth.id)
    return Manager.objects.get(auth_id=auth.id)
