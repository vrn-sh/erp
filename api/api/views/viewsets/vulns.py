from typing import List, Optional
from warnings import warn

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from knox.auth import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.views import Response
from django.core.cache import cache

from api.models import Auth
from api.models.vulns import Notes, VulnType, Vulnerability
from api.permissions import IsManager, IsLinkedToData, IsPentester, ReadOnly

from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer


class NotesViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsManager | permissions.IsAuthenticated & IsLinkedToData]
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer

    @swagger_auto_schema(
        operation_description="Creates a notes object. Must be done by a logged user, member of the team's mission.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['mission', 'content'],
            properties={
                'title': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Title of the note, if any"
                ),
                'mission': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description="Id of the mission",
                ),
                'content': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Content of the note"
                ),
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "title": "String Termination Error in home page search bar",
                    "mission": 7,
                    "content": "This is a smart content about smart vulnerabilities."
                }
            )
        },
        security=['Bearer'],
        tags=['notes'],
    )
    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data.pop("author", None)
        request.data["last_editor"] = request.user.id
        return super().update(request, *args, **kwargs)


class VulnTypeViewset(viewsets.ModelViewSet):
    """
        CRUD to add a new vulnerability type. Shouldn't happen often, but still.
    """
    queryset = VulnType.objects.all()
    permissions = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnTypeSerializer


class VulnerabilityViewset(viewsets.ModelViewSet):
    """
        CRUD to manage vulnerabilities.
    """
    queryset = Vulnerability.objects.order_by('id')
    permissions = [permissions.IsAuthenticated, IsLinkedToData & IsPentester | IsManager & IsLinkedToData & ReadOnly]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnerabilitySerializer

    CACHE_KEY_PREFIX = 'vuln_'
    CACHE_TIMEOUT = 60 * 60 * 24 # 24 hours

    @property
    def filtered_queryset(self):
        user = self.request.user
        if user.is_manager:
            return Vulnerability.objects.order_by('id')
        return Vulnerability.objects.filter(team__members__auth__id=user.id)

    def get_queryset(self):
        return self.filtered_queryset

    @swagger_auto_schema(
        operation_description="Creates a vulnerability. Must be done by a member of the team",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['title', 'severity', 'vuln_type'],
            properties={
                'title': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Vulnerability name. Should be a complement of its type."
                ),
                'severity': openapi.Schema(
                    type=openapi.TYPE_NUMBER,
                    description="Severity (0.0 == low, 10.0 == critical)",
                ),
                'vuln_type': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Id of the vulnerability type?",
                ),
                'images': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_FILE,
                        description="image as base64",
                    ),
                    description="array of screenshots (max 4)"
                )
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "title": "Stack Overflow",
                    "severity": 0.99,
                    "vuln_type": 1,
                    "images": [],
                }
            )
        },
        security=['Bearer'],
        tags=['vulnerability'],
    )

    def retrieve(self, request, *args, **kwargs):
        cache_key = f'{self.CACHE_KEY_PREFIX}{kwargs["pk"]}_{request.user.team.id}'
        vuln = cache.get(cache_key)

        if not vuln:
            vuln = self.get_object()
            serializer = self.get_serializer(vuln)
            vuln = serializer.data
            cache.set(cache_key, vuln, self.CACHE_TIMEOUT)
        return Response(vuln)

    def list(self, request, *args, **kwargs):
        team_id = request.user.team.id
        cache_key = f'{self.CACHE_KEY_PREFIX}list_{team_id}'
        vulns = cache.get(cache_key)

        if not vulns:
            vulns = self.get_queryset()
            serializer = self.get_serializer(vulns, many=True, read_only=True)
            vulns = serializer.data
            cache.set(cache_key, vulns, self.CACHE_TIMEOUT)
        return Response(vulns)

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id

        vuln = request.data.get('vuln_type')
        if not vuln:
            return Response({
                'errors': 'missing "vuln_type" field',
            }, status=HTTP_400_BAD_REQUEST)

        vuln_obj = VulnType.objects.filter(name=vuln).first()
        if not vuln_obj:
            return Response({
                'errors': 'unknown "vuln_type" type',
            }, status=HTTP_400_BAD_REQUEST)

        request.data['vuln_type'] = vuln_obj.id
        if 'description' not in request.data:
            request.data['description'] = vuln_obj.description

        team_id = request.user.team.id
        response = super().create(request, *args, **kwargs)
        cache_key = f'{self.CACHE_KEY_PREFIX}{request.data["mission"]}_{team_id}'
        cache.set(cache_key, response.data, self.CACHE_TIMEOUT)

        return response

    def update(self, request, *args, **kwargs):
        if 'author' in request.data:
            request.data.pop('author')

        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id

        if 'vuln_type' in request.data:
            vuln_obj = VulnType.objects.filter(name=request.data['vuln_type']).first()
            if not vuln_obj:
                return Response({
                    'errors': 'unknown "vuln_type" type',
                }, status=HTTP_400_BAD_REQUEST)
            request.data['vuln_type'] = vuln_obj.id
            if not 'description' in request.data:
                request.data['description'] = vuln_obj.description

        team_id = request.user.team.id
        response = super().update(request, *args, **kwargs)
        cache_key = f'{self.CACHE_KEY_PREFIX}{request.data["mission"]}_{team_id}'
        cache.set(cache_key, response.data, self.CACHE_TIMEOUT)

        return response
