"""This module stores the generic viewsets used when basic CRUD is required

- AuthViewset: Auth class CRUD
- RegisterViewset: Pentester creation route
- PentesterViewset: Pentester CRUD
- ManagerViewset: Manager CRUD
- NodeViewset: Node class CRUD
- AddressViewset: Address class CRUD (no preloaded data)
"""

from io import BytesIO
import os
from typing import List, Optional
import uuid

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from rest_framework import viewsets, permissions
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import Response

from knox.auth import TokenAuthentication

from api.backends import EmailBackend

from api.serializers import ManagerSerializer, PentesterSerializer, TeamSerializer
from api.models import USER_ROLES, Manager, Pentester, Team, get_user_model
from api.permissions import IsManager, IsLinkedToData, IsPentester, PostOnly, ReadOnly
from api.serializers.utils import get_image_data, get_mime_type
from api.services.s3 import S3Bucket


class TeamViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
        Create and manage teams
    """

    queryset = Team.objects.all()  # type: ignore
    permission_classes = [
        permissions.IsAuthenticated,
        IsManager | IsPentester & ReadOnly
    ]
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
        if auth and auth.get('role', 'manager') == 'manager':  # type: ignore
            return Manager.objects.all()  # type: ignore
        return Pentester.objects.all()  # type: ignore

    def get_serializer_class(self):
        auth = self.request.data.get('auth')  # type: ignore
        if auth and auth.get('role', 'manager') == 'manager':  # type: ignore
            return ManagerSerializer
        return PentesterSerializer


class PentesterViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        PentesterViewset
            CRUD operations for Pentester model (encompasses Auth model as well)
    """

    queryset = Pentester.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated, IsManager | IsLinkedToData]
    authentication_classes = [TokenAuthentication]
    serializer_class = PentesterSerializer

    def set_image(self, request) -> Optional[str]:

        image = request.data['auth'].get('profile_image') if 'auth' in request else None
        if image:

            mime_type = get_mime_type(image)
            image_data = get_image_data(image_data)  # type: ignore

            if not mime_type or not image_data:
                return None

            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                return None

            s3_client = S3Bucket()
            image_name = f'{uuid.uuid4().hex}'

            iostream = BytesIO(image_data)  # type: ignore
            _ = s3_client.upload_stream(
                'rootbucket',
                image_name,
                iostream,
                f'image/{mime_type}',
            )
            return image_name
        return None


    def update(self, request, *args, **kwargs):
        if 'auth' in request.data:
            token = S3Bucket().upload_single_image_if_exists(
                'profile_image',
                request.data['auth'],
            )
            request.data['auth']['profile_image'] = token
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if 'auth' in request.data:
            token = S3Bucket().upload_single_image_if_exists(
                'profile_image',
                request.data['auth'],
            )
            request.data['auth']['profile_image'] = token
        return super().partial_update(request, *args, **kwargs)



class ManagerViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
       ManagerViewset
            CRUD operations for Manager model (encompasses Auth model as well)
    """

    queryset = Manager.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated & IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = ManagerSerializer

    def update(self, request, *args, **kwargs):
        if 'auth' in request.data:
            token = S3Bucket().upload_single_image_if_exists(
                'profile_image',
                request.data['auth'],
            )
            request.data['auth']['profile_image'] = token
        return super().update(request, *args, **kwargs)
