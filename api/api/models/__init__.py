"""This module manages generic models required for users & authentication

The following models are present here:

    - Auth: Base user login table (stores first_name, last_name, username, email, password, etc...)
    - Pentester: Model storing basic user information
    - Admin: Model used for admins. Can do account creation, overall administration, etc.
"""

import os
from django.db import models
from django.contrib.auth.models import AbstractUser
from argon2 import PasswordHasher
from phonenumber_field.modelfields import PhoneNumberField
from django.core.mail import send_mail


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
        (1, 'customer'),
        (2, 'admin'),
    )

    id = models.AutoField(primary_key=True)
    role = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, editable=False)
    password = models.CharField(max_length=128)
    phone_number = PhoneNumberField(null=True, blank=True)
    email = models.EmailField(unique=True, null=False, blank=False)

    # account confirmation / password reset stuff
    # TODO: have a different token for password reset & account confirmation
    tmp_token = models.CharField(max_length=32, null=True, default=None)
    is_disabled = models.BooleanField(default=True)

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
        url = f'https://voron.sh/reset?token={self.tmp_token}'
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


class Admin(models.Model):
    """
        Admin model

        auth -> one-to-one to Auth model
        creation_date -> read-only field expressing creation date

    """
    class Meta:
        verbose_name = 'Administrator'
        verbose_name_plural = 'Administrators'
        ordering = ['creation_date']

    id = models.AutoField(primary_key=True)
    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now=True, editable=False)


class Pentester(models.Model):
    """
        Pentester model

        (Main difference with Admin model is that Customers can own domains)

        auth -> one-to-one to Auth model
        creation_date -> read-only field expressing creation date
    """
    class Meta:
        verbose_name = 'Pentester'
        verbose_name_plural = 'Customers'
        ordering = ['creation_date']

    id = models.AutoField(primary_key=True)
    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now=True, editable=False)
