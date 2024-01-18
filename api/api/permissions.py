"""this module stores the various authorization middlewares used throughout the project

(user should already be authenticated when going through these)
"""

import logging
from typing import List

from rest_framework import permissions

from api.models import USER_ROLES, Auth, Freelancer, Pentester, Manager, Team
from api.models.mission import Credentials, Mission, NmapScan, Recon
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


class IsLinkedToData(permissions.BasePermission):
    """
        IsLinkedToData

        middleware checking if user owns the resource it tries to read / update / delete
        checks have to be performed manually.
    """

    def has_permission(self, _, __):
        return True

    def has_object_permission(self, request, _, obj):

        if request.user is None:
            return False

        if isinstance(obj, Auth):
            return obj.id == request.user.id # type: ignore

        if isinstance(obj, (Pentester, Manager, Freelancer)):
            return obj.auth.id == request.user.id # type: ignore

        if isinstance(obj, (Notes, Vulnerability)):
            # FIXME: this should check for if user is member of related team
            return obj.author.id == request.user.id  # type: ignore

        if isinstance(obj, Team):
            for m in obj.members.all():  # type: ignore
                if request.user.id == m.auth.id:
                    return True
            return obj.leader.auth.id == request.user.id  # type: ignore

        if isinstance(obj, Mission):
            if obj.freelance_member is not None:
                return request.user.id == obj.freelance_member.id  # type: ignore

            if not obj.team:
                return False

            for m in obj.team.members.all():  # type: ignore
                if m.auth.id == request.user.id:
                    return True
            return obj.team.leader.auth.id == request.user.id  # type: ignore

        if isinstance(obj, Credentials):
            mission_obj = Mission.objects.filter(creds_id=obj.id).first()
            if not mission_obj:
                logging.warning('Credentials <%d> has no team', obj.id)
                return False
            return True

        if isinstance(obj, Recon):
            mission_obj = Mission.objects.filter(recon_id=obj.id).first()  # type: ignore
            if not mission_obj:
                logging.warning('Recon <%d> has no team', obj.id)  # type: ignore
                return False

            if mission_obj.freelance_member:
                return request.user.id == mission_obj.freelance_member.id

            for m in mission_obj.team.members.all():
                if m.auth.id == request.user.id:
                    return True
            return mission_obj.team.leader.auth.id == request.user.id

        if isinstance(obj, NmapScan):
            mission_obj = Mission.objects.filter(recon_id=obj.recon.id).first()  # type: ignore
            if not mission_obj:
                logging.warning('NmapScan <%d> has no team', obj.id)  # type: ignore
                return False

            if mission_obj.freelance_member:
                return request.user.id == mission_obj.freelance_member.id

            for m in mission_obj.team.members.all():
                if m.auth.id == request.user.id:
                    return True
            return mission_obj.leader.auth.id == request.user.id

        logging.warning('permissions: Object <%s> has not reached anything',
                str({type(obj)}))
        return False


def user_has_role(request, role: str) -> bool:
    """checks if a user has the appropriate role (being 1, 2 or 3)"""
    user_roles = ['placeholder', 'pentester', 'manager', 'freelancer']
    return user_roles[request.user.role] == role


class IsManager(permissions.BasePermission):
    """checks if user IS an """
    def has_permission(self, request, _):
        return user_has_role(request, 'manager')

    def has_object_permission(self, request, _, __):
        return user_has_role(request, 'manager')


class IsNotManager(permissions.BasePermission):
    """checks if current user is NOT an manager"""
    def has_permission(self, request, _):
        return not user_has_role(request, 'manager')

    def has_object_permission(self, request, _, __):
        return not user_has_role(request, 'manager')


class IsFreelancer(permissions.BasePermission):
    """checks if user IS a freelancer"""
    def has_permission(self, request, _):
        return user_has_role(request, 'freelancer')

    def has_object_permission(self, request, _, __):
        return user_has_role(request, 'freelancer')


class IsNotFreelancer(permissions.BasePermission):
    """checks if user is NOT a freelancer"""
    def has_permission(self, request, _):
        return not user_has_role(request, 'freelancer')

    def has_object_permission(self, request, _, __):
        return not user_has_role(request, 'freelancer')


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
