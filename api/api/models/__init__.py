"""This module manages generic models required for users & authentication

The following models are present here:

    - Auth: Base user login table (stores first_name, last_name, username, email, password, etc...)
    - Pentester: Model storing basic user information
    - Admin: Model used for admins. Can do account creation, overall administration, etc.
"""

import os
from typing import List, Optional
from django.db import models
from django.contrib.auth.models import AbstractUser
from argon2 import PasswordHasher
from django.db.models.deletion import CASCADE
from phonenumber_field.modelfields import PhoneNumberField
from django.core.mail import send_mail

MAX_TITLE_LENGTH = 256
MAX_NOTE_LENGTH = 8186
MAX_LINK_LENGTH = 1024
NAME_LENGTH = 256

class Auth(AbstractUser):
    """
        Auth Model:

            Basic model used to log in users.
            When authenticating users through views, this is the model recovered from the Token

        role: string containing the current role of the user
        password: hashed password of the user
        phone_number: phone number used for MFA (should use E164 format)
        tmp_token: token automatically generated, used for password reset or account confirmation
        is_disabled: boolean value checking if user has been locked, or has not confirmed account yet

    """

    class Meta:
        verbose_name = 'Basic user auth model'
        verbose_name_plural = 'Basic user auth models'
        ordering = ['email']

    REQUIRED_FIELDS = ['email', 'password']

    USER_TYPE_CHOICES = (
        (1, 'pentester'),
        (2, 'admin'),
    )

    id: models.AutoField = models.AutoField(primary_key=True)
    role: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, editable=False)
    password: models.CharField = models.CharField(max_length=128)
    phone_number: Optional[PhoneNumberField] = PhoneNumberField(null=True, blank=True)
    email: models.EmailField = models.EmailField(unique=True, null=False, blank=False)

    # account confirmation / password reset stuff
    # TODO: have a different token for password reset & account confirmation
    tmp_token: models.CharField = models.CharField(max_length=32, null=True, default=None)
    is_disabled: models.BooleanField = models.BooleanField(default=True)

    def set_password(self, raw_password: str | None = None):
        if not raw_password:
            return
        hashed = PasswordHasher().hash(raw_password)
        self.password = hashed

    def check_password(self, raw_password=None) -> bool:
        return PasswordHasher().verify(self.password, raw_password) if raw_password else False

    def send_confirm_email(self) -> int:
        """sends account-confirmation email"""
        url = f'https://voron.sh/confirm?token={self.tmp_token}'
        return send_mail(
            f'Welcome {self.first_name} !',
            f'Hello and welcome!\nPlease click on the following link to confirm your account:{url}',
            os.environ['SENDGRID_SENDER'],
            [self.email],
            fail_silently=False,
        )

    def send_reset_password_email(self) -> int:
        """sends password-reset email"""
        url = f'https://voron.djnn.sh/reset?token={self.tmp_token}'
        return send_mail(
            f'{self.first_name}, reset your password',
            f'Please click on the following link to reset your password:{url}',
            os.environ['SENDGRID_SENDER'],
            [self.email],
            fail_silently=False,
        )

    def save(self, *args, **kwargs) -> None:
        if self.pk is None:
            #self.send_confirm_email()
            self.is_disabled = False
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

    REQUIRED_FIELDS = ['name', 'owner', 'members']

    name: models.CharField = models.CharField(max_length=32)
    leader: Manager = models.OneToOneField(Manager, on_delete=CASCADE)
    members: List[Pentester] = models.ManyToManyField(Pentester, blank=True)


AuthenticatedUser = Pentester | Manager


def get_user_model(auth: Auth) -> AuthenticatedUser:
    """fetches User model from base authentication model"""

    roles = ['placeholder', 'pentester', 'manager']

    if roles[auth.role] == 'pentester':
        return Pentester.objects.get(auth_id=auth.id)
    return Manager.objects.get(auth_id=auth.id)
