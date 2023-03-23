"""This module stores the generic viewsets used when basic CRUD is required

- AuthViewset: Auth class CRUD
- RegisterViewset: Pentester creation route
- PentesterViewset: Pentester CRUD
- ManagerViewset: Manager CRUD
- NodeViewset: Node class CRUD
- AddressViewset: Address class CRUD (no preloaded data)
"""

from typing import List
from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import Response
from api.backends import EmailBackend

from api.serializers import AdminSerializer, PentesterSerializer, AuthSerializer, TeamSerializer

from api.models import Manager, Auth, Pentester, Team, get_user_model

from api.permissions import IsManager, IsOwner, PostOnly, ReadOnly


class TeamViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
        Create and manage teams
    """

    queryset = Team.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsManager | \
            permissions.IsAuthenticated & ReadOnly]
    authentication_classes = [TokenAuthentication]
    serializer_class = TeamSerializer


    def create(self, request, *args, **kwargs):
        owner = EmailBackend().get_user_by_email(request.user.email)
        assert owner is not None

        owner_model = get_user_model(owner)
        request.data['leader'] = owner_model.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'leader' in request.data:
            return Response({'error': 'cannot change owner once it is set!'}, status=HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)


class RegisterViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        RegisterViewset:
            Binding to pentesterSerializer in order to register new account
    """

    queryset = Pentester.objects.all()
    permission_classes = [PostOnly]
    authentication_classes: List[type[TokenAuthentication]] = []
    serializer_class = PentesterSerializer

class PentesterViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        PentesterViewset
            CRUD operations for Pentester model (encompasses Auth model as well)
    """

    queryset = Pentester.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsManager | IsOwner]
    authentication_classes = [TokenAuthentication]
    serializer_class = PentesterSerializer


class ManagerViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
       ManagerViewset
            CRUD operations for Admin model (encompasses Auth model as well)
    """

    queryset = Manager.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = AdminSerializer


class AuthViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        AuthViewset
            currently unused but might be useful later
    """

    queryset = Auth.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager | IsOwner]
    authentication_classes = [TokenAuthentication]
    serializer_class = AuthSerializer
