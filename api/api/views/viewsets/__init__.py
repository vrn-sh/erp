"""This module stores the generic viewsets used when basic CRUD is required

- AuthViewset: Auth class CRUD
- RegisterViewset: Pentester creation route
- PentesterViewset: Pentester CRUD
- ManagerViewset: Manager CRUD
- NodeViewset: Node class CRUD
- AddressViewset: Address class CRUD (no preloaded data)
"""

import os
from typing import List

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework import viewsets, permissions
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import Response

from knox.auth import TokenAuthentication

from api.backends import EmailBackend

from api.serializers import FreelancerSerializer, ManagerSerializer, PentesterSerializer, TeamSerializer
from api.models import USER_ROLES, Manager, Pentester, Freelancer, Team, get_user_model
from api.permissions import IsManager, IsLinkedToData, IsPentester, PostOnly, ReadOnly
from api.services.s3 import S3Bucket

from django.db.models import Q


class TeamViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
        Create and manage teams
    """

    queryset = Team.objects.all()  # type: ignore
    permission_classes = [
        permissions.IsAuthenticated,
        IsLinkedToData,
        IsManager | IsPentester & ReadOnly
    ]
    authentication_classes = [TokenAuthentication]
    serializer_class = TeamSerializer

    @swagger_auto_schema(
        operation_description="Lists all teams. Must be done by a Manager or a Pentester.",
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
        security=['Bearer'],
        tags=['Team'],
    )
    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Team.objects.none()  # type: ignore
        owner = EmailBackend().get_user_by_email(self.request.user.email)
        if owner is None:
            return Team.objects.none()  # type: ignore

        owner_model = get_user_model(owner)
        if USER_ROLES[owner.role] == 'manager':  # type: ignore
            queryset = Team.objects.filter(leader=owner_model.id)  # type: ignore
        else:
            queryset = Team.objects.filter(members__in=[owner_model.id])  # type: ignore

        return queryset

    def list(self, request, *args, **kwargs):
        owner = EmailBackend().get_user_by_email(request.user.email)
        name_query = request.query_params.get('search', None)

        if owner is None:
            return Response({
                'error': 'user does not exist',
            }, status=HTTP_400_BAD_REQUEST)

        queryset = self.get_queryset()

        if name_query:
            queryset = queryset.filter(Q(name=name_query))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

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
        security=['Bearer'],
        tags=['Team'],
    )
    def create(self, request, *args, **kwargs):
        owner = EmailBackend().get_user_by_email(request.user.email)
        if owner is None or USER_ROLES[owner.role] != 'manager':  # type: ignore
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
        security=['Bearer'],
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

    permission_classes = [PostOnly]
    authentication_classes: List[type[TokenAuthentication]] = []

    def get_queryset(self):
        auth = self.request.data.get('auth')  # type: ignore
        if auth and auth.get('role') == 'pentester':  # type: ignore
            return Pentester.objects.all()  # type: ignore

        if auth and auth.get('role') == 'freelancer':  # type: ignore
            return Freelancer.objects.all()  # type: ignore

        return Manager.objects.all()  # type: ignore

    def get_serializer_class(self):  # type: ignore
        auth = self.request.data.get('auth')  # type: ignore
        if auth and auth.get('role') == 'pentester':  # type: ignore
            return PentesterSerializer

        if auth and auth.get('role') == 'freelancer':  # type: ignore
            return FreelancerSerializer

        return ManagerSerializer


class PentesterViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        PentesterViewset
            CRUD operations for Pentester model (encompasses Auth model as well)
    """

    queryset = Pentester.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated, IsManager | IsLinkedToData]
    authentication_classes = [TokenAuthentication]
    serializer_class = PentesterSerializer

    def list(self, request, *args, **kwargs):
        name_query = request.query_params.get('search', None)

        if name_query:
            teams = self.get_queryset().filter(Q(auth__username=name_query))
            serializer = self.get_serializer(teams, many=True)
            return Response(serializer.data)

        # If no query, just do the normal `list()`
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'auth' in request.data:

            if not '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                token = S3Bucket().upload_single_image_if_exists(
                    'profile_image',
                    request.data['auth'],
                )
                request.data['auth']['profile_image'] = token
        return super().update(request, *args, **kwargs)


class FreelancerViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
       FreelancerViewset
            CRUD operations for Freelancer model (encompasses Auth model as well)
    """

    queryset = Freelancer.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated & IsLinkedToData]
    authentication_classes = [TokenAuthentication]
    serializer_class = FreelancerSerializer

    def update(self, request, *args, **kwargs):
        if 'auth' in request.data:

            if not '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                token = S3Bucket().upload_single_image_if_exists(
                    'profile_image',
                    request.data['auth'],
                )
                request.data['auth']['profile_image'] = token
        return super().update(request, *args, **kwargs)


class ManagerViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
       ManagerViewset
            CRUD operations for Manager model (encompasses Auth model as well)
    """

    queryset = Manager.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated & IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = ManagerSerializer

    def list(self, request, *args, **kwargs):
        name_query = request.query_params.get('search', None)

        if name_query:
            teams = self.get_queryset().filter(Q(auth__username=name_query))
            serializer = self.get_serializer(teams, many=True)
            return Response(serializer.data)

        # If no query, just do the normal `list()`
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'auth' in request.data:
            if not '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                token = S3Bucket().upload_single_image_if_exists(
                    'profile_image',
                    request.data['auth'],
                )
                request.data['auth']['profile_image'] = token
        return super().update(request, *args, **kwargs)
