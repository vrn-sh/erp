import argon2.exceptions
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

from api.models import Auth

"""This module stores the authentication backend (How do we fetch the user for the auth token, etc)"""

class EmailBackend(ModelBackend):
    supports_object_permissions = True
    supports_anonymous_user = False
    supports_inactive_user = False

    @staticmethod
    def get_user_by_email(email):
        model = get_user_model()
        return model.objects.filter(email=email).first()

    @staticmethod
    def get_user(user_id):
        model = get_user_model()
        return model.objects.filter(pk=user_id).first()

    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = self.get_user_by_email(email=email)
            return user if user and user.check_password(password) else None
        except argon2.exceptions.VerifyMismatchError:
            return None
