"""This module manages generic models required for users & authentication

The following models are present here:

    - Auth: Base user login table (stores first_name, last_name, username, email, password, etc...)
    - Pentester: Model storing basic user information
    - Admin: Model used for admins. Can do account creation, overall administration, etc.
"""

import uuid
from logging import info, warning
import os
from django.contrib.postgres.fields import ArrayField
from typing import List, Optional
from rest_framework.serializers import CharField

from argon2 import PasswordHasher

from phonenumber_field.modelfields import PhoneNumberField

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE
from django.core.mail import send_mail
from django.core.cache import cache

from api.services.sendgrid_mail import SendgridClient

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
        is_enabled: boolean value checking if user has been locked, or has not confirmed account yet
        favorites: value use for front-end to decide which favorites to display
        profile_image: key holding the value of an image in the bucket

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
    is_enabled: models.BooleanField = models.BooleanField(default=False)  # type: ignore
    favorites: Optional[List[CharField]] = ArrayField(models.CharField(max_length=32), blank=True, null=True, size=4)  # type: ignore

    # will hold a key that can be fetched by S3 service to get a profile image
    profile_image: Optional[CharField] = models.CharField(max_length=38, null=True, blank=True)  # type: ignore


    def set_password(self, raw_password: str | None = None):
        if not raw_password:
            return
        hashed = PasswordHasher().hash(raw_password)
        self.password = hashed  # type: ignore

    def check_password(self, raw_password=None) -> bool:
        return PasswordHasher().verify(self.password, raw_password) if raw_password else False  # type: ignore

    def send_confirm_email(self) -> int:
        """sends account-confirmation email"""

        if '1' in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            warning(f'Passing send_confirm_email() to {self.email}')
            return 1

        tmp_token = uuid.uuid4().hex
        url = f'https://{os.environ["DOMAIN_NAME"]}/confirm?token={tmp_token}'
        cache.set(tmp_token, self.email, CONFIRM_TOKEN_TIMEOUT_SECONDS)

        warning(f'Sending confirmation email to {self.email}')
        template_id = os.environ.get('SENDGRID_CONFIRM_TEMPLATE_ID')
        if not template_id:
            return send_mail(
                f'Welcome {self.first_name} !',
                f'Hello and welcome!\nPlease click on this link to confirm your account: {url}',
                os.environ['SENDGRID_SENDER'],
                [self.email],
            )

        mail = SendgridClient([self.email])  # type: ignore
        mail.set_template_data({
            'username': self.first_name,
            'url': url
        })
        mail.set_template_id(template_id)
        return mail.send()

    def send_reset_password_email(self) -> int:
        """sends password-reset email"""

        if '1' in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            info(f'Passing send_reset_password_email() to {self.email}')
            return 1

        tmp_token = uuid.uuid4().hex
        url = f'https://{os.environ["DOMAIN_NAME"]}/reset?token={tmp_token}'
        cache.set(tmp_token, self.email, RESETPW_TOKEN_TIMEOUT_SECONDS)

        warning(f'Sending password-reset email to {self.email}')
        template_id = os.environ.get('SENDGRID_RESET_TEMPLATE_ID')
        if not template_id:
            return send_mail(
                f'{self.first_name}, reset your password',
                f'Hello there\nPlease click on this link to reset your password: {url}',
                os.environ['SENDGRID_SENDER'],
                [self.email],
            )

        mail = SendgridClient([self.email])
        mail.set_template_data({
            'username': self.first_name,
            'email': self.email,
            'url': url,
        })
        mail.set_template_id(template_id)
        return mail.send()


    def save(self, *args, **kwargs) -> None:
        if self.is_enabled is False:
            self.send_confirm_email()
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
    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
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
    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date: models.DateField = models.DateField(auto_now=True, editable=False)


class Team(models.Model):
    """Model for representing a team of pentester, with one manager"""
    class Meta:
        verbose_name = 'Team'
        verbose_name_plural = 'Teams'
        ordering = ['name']

    REQUIRED_FIELDS = ['name', 'leader', 'members']

    name = models.CharField(max_length=32)
    leader = models.ForeignKey(Manager, on_delete=CASCADE)
    members = models.ManyToManyField(Pentester, blank=True)

    def is_member(self, user: Auth) -> bool:
        """check if user is member of the team"""
        members_auth = [x.a for x in self.members.all()]
        return self.leader.auth == user or user in members_auth


AuthenticatedUser = Pentester | Manager


def get_user_model(auth: Auth) -> AuthenticatedUser:
    """fetches User model from base authentication model"""

    roles = ['placeholder', 'pentester', 'manager']

    if roles[auth.role] == 'pentester':
        return Pentester.objects.get(auth_id=auth.id)
    return Manager.objects.get(auth_id=auth.id)
