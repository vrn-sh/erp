from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractUser
from argon2 import PasswordHasher


"""This module manages generic models required for users & authentication

The following models are present here:

    - TwoFactorAuth: table for 2FA management (stores token, which is the prefered way of doing 2FA, etc)
    - Auth: Base user login table (stores first_name, last_name, username, email, password, etc...)
    - Pentester: Model storing basic user information
    - Manager: Model used for managers. Can do account creation, overall manageristration, etc.
"""


class TwoFactorAuth(models.Model):
    """Stores 2FA information related to the user

        2FA code should be active for approximately one minute.

        - enabled: boolean field checking if 2FA is enabled
        - method: which is the prefered way of doing 2FA ?
        - secret: magic secret token for 2FA
        - issued_at: secret creation timestamp
    """

    class Meta:
        verbose_name = '2FA metadata'
        verbose_name_plural = '2FA metadata'

    PROVIDER_OPTIONS = (
        (1, 'mobile_phone'),
        (2, 'email'),
        (3, 'authenticator_app')
    )

    enabled = models.BooleanField(default=False)
    method = models.PositiveSmallIntegerField(choices=PROVIDER_OPTIONS)
    secret = models.CharField(max_length=64, null=True, blank=True)
    issued_at = models.DateTimeField(auto_now_add=True, editable=False)


class Auth(AbstractUser):
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        ordering = ['email']

    REQUIRED_FIELDS = ['email', 'password']

    USER_TYPE_CHOICES = (
        (1, 'pentester'),
        (2, 'manager'),
    )

    role = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, editable=False)
    email = models.CharField(max_length=64, unique=True)
    password = models.CharField(max_length=128)
    two_factor = models.OneToOneField(TwoFactorAuth, on_delete=models.CASCADE)

    def set_password(self, raw_password=None):
        hashed = PasswordHasher().hash(raw_password)
        self.password = hashed

    def check_password(self, raw_password=None) -> bool:
        return PasswordHasher().verify(self.password, raw_password) if raw_password else False


class Manager(models.Model):
    class Meta:
        verbose_name = 'Manager'
        verbose_name_plural = 'Managers'
        ordering = ['creation_date']

    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now=True, editable=False)


class Pentester(models.Model):
    class Meta:
        verbose_name = 'Pentester'
        verbose_name_plural = 'Pentesters'
        ordering = ['creation_date']

    auth = models.OneToOneField(Auth, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now=True, editable=False)
