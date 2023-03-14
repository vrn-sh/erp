"""this module stores the various authorization middlewares used throughout the project

(user should already be authenticated when going through these)
"""

import logging
from typing import List

from rest_framework import permissions
from api.models import Auth, Pentester, Admin
from api.models.vulns import Notes, Vulnerability


class MethodOnly(permissions.BasePermission):
    """
        MethodOnly

        base class to specify which methods of a Viewset can only be used
    """
    SAFE_METHODS: List[str] = []

    def has_permission(self, request, _):
        """check if current method (POST, GET, etc) is allowed with SAFE_METHODS"""
        if request.method in self.SAFE_METHODS:
            return True
        return False


class DeleteOnly(MethodOnly):
    """Allow only DELETE methods"""
    SAFE_METHODS = ['DELETE']


class ReadOnly(MethodOnly):
    """Allow only GET methods"""
    SAFE_METHODS = ['GET']


class PostOnly(MethodOnly):
    """Allow only POST methods"""
    SAFE_METHODS = ['POST']


class IsOwner(permissions.BasePermission):
    """
        IsOwner

        middleware checking if user owns the resource it tries to read / update / delete
        checks have to be performed manually.
    """

    def has_permission(self, _, __):
        return True

    def has_object_permission(self, request, _, obj):
        if isinstance(obj, Auth):
            return obj.id == request.user.id # type: ignore

        if isinstance(obj, Pentester) or isinstance(obj, Admin):
            return obj.auth.id == request.user.id # type: ignore

        if isinstance(obj, Notes) or isinstance(obj, Vulnerability):
            return obj.author.id == request.user.id

        logging.warning('IsOwner permissions: Object <%s> has not reached anything',
                str({type(obj)}))
        return False


def user_has_role(request, role: str) -> bool:
    """checks if a user has the appropriate role (being 1 or 2)"""
    user_roles = ['placeholder', 'pentester', 'admin']
    return user_roles[request.user.role] == role


class IsAdmin(permissions.BasePermission):
    """checks if user IS an admin"""
    def has_permission(self, request, _):
        return user_has_role(request, 'admin')

    def has_object_permission(self, request, _, __):
        return user_has_role(request, 'admin')


class IsNotAdmin(permissions.BasePermission):
    """checks if current user is NOT an admin"""
    def has_permission(self, request, _):
        return not user_has_role(request, 'admin')

    def has_object_permission(self, request, _, __):
        return not user_has_role(request, 'admin')


class IsPentester(permissions.BasePermission):
    """checks if user IS a pentester"""
    def has_permission(self, request, _):
        return user_has_role(request, 'pentester')

    def has_object_permission(self, request, _, __):
        return user_has_role(request, 'pentester')


class IsNotPentester(permissions.BasePermission):
    """checks if user is NOT a pentester"""
    def has_permission(self, request, _):
        return not user_has_role(request, 'pentester')

    def has_object_permission(self, request, _, __):
        return not user_has_role(request, 'pentester')
