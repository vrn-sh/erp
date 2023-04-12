"""This module stores the generic viewsets used when basic CRUD is required

- AuthViewset: Auth class CRUD
- RegisterViewset: Pentester creation route
- PentesterViewset: Pentester CRUD
- ManagerViewset: Manager CRUD
- NodeViewset: Node class CRUD
- AddressViewset: Address class CRUD (no preloaded data)
"""

from typing import List

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import Response
from api.backends import EmailBackend

from api.serializers import ManagerSerializer, PentesterSerializer, AuthSerializer, TeamSerializer

from api.models import USER_ROLES, Manager, Auth, Pentester, Team, get_user_model

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

    @swagger_auto_schema(
        operation_description="Creates a team. Must be done by a Manager.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['name', 'members'],
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING,
                                       description="Team name"),
                'members': openapi.Schema(type=openapi.TYPE_ARRAY, 
                                          description="Array of id members",
                                          items=openapi.Items(type=openapi.TYPE_INTEGER),),
                'leader': openapi.Schema(type=openapi.TYPE_INTEGER, 
                                         description="Id of the leader"),
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "name": "Ohayo Sekai",
                    "members": [1, 2],
                    "leader": 1
                }
            )
        },
        security=[],
        tags=['Team'],
    )
    def create(self, request, *args, **kwargs):
        owner = EmailBackend().get_user_by_email(request.user.email)
        if owner is None or USER_ROLES[owner.role] != 'manager':
            return Response({
                'error': 'user cannot create a team',
            }, status=HTTP_400_BAD_REQUEST)

        owner_model = get_user_model(owner)
        request.data['leader'] = owner_model.id
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Updates a team with its [id]. Must be done by a Manager."
                              "Cannot change the leader once set.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=[],
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING,
                                       description="Team name"),
                'members': openapi.Schema(type=openapi.TYPE_ARRAY, 
                                          description="Array of id members",
                                          items=openapi.Items(type=openapi.TYPE_INTEGER),),
            },
        ),
        responses={
            "201": openapi.Response(
                description="201 OK",
                examples={
                    "id": 1,
                    "name": "Ohayo Sekai",
                    "members": [1, 2],
                    "leader": 1
                }
            )
        },
        security=[],
            tags=['Team'],
    )
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
            CRUD operations for Manager model (encompasses Auth model as well)
    """

    queryset = Manager.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = ManagerSerializer


class AuthViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        AuthViewset
            currently unused but might be useful later
    """

    queryset = Auth.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager | IsOwner]
    authentication_classes = [TokenAuthentication]
    serializer_class = AuthSerializer
