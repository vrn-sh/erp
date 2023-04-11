"""This module stores the authentication backend"""

from typing import Optional
import argon2.exceptions
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import AbstractBaseUser

from api.models import Auth


class EmailBackend(ModelBackend):
    """Basic email backend (authenticate with email and password)"""

    supports_object_permissions = True
    supports_anonymous_user = False
    supports_inactive_user = False

    def get_user_by_email(self, email) -> Optional[Auth]:
        """fetches user by his email"""
        return Auth.objects.filter(email=email).first()

    def get_user(self, user_id) -> Optional[AbstractBaseUser]:
        return Auth.objects.filter(pk=user_id).first()

    def authenticate(self, _, username=None, password=None, **__):
        try:
            user = self.get_user_by_email(email=username)
            return user if user and password and user.check_password(password) else None
        except argon2.exceptions.VerifyMismatchError:
            return None
