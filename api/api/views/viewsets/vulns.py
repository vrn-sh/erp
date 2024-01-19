
import os
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from knox.auth import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import Response

from api.models.vulns import Notes, VulnType, Vulnerability
from api.permissions import IsFreelancer, IsManager, IsLinkedToData, IsPentester, ReadOnly

from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer
from api.services.s3 import S3Bucket
from django.db.models import Q


class NotesViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()  # type: ignore
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
    queryset = VulnType.objects.all()  # type: ignore
    permissions = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnTypeSerializer
    def list(self, request, *args, **kwargs):
        name_query = request.query_params.get('search', None)

        if name_query:
            teams = self.get_queryset().filter(Q(name=name_query))
            serializer = self.get_serializer(teams, many=True)
            return Response(serializer.data)

        # If no query, just do the normal `list()`
        return super().list(request, *args, **kwargs)

class VulnerabilityViewset(viewsets.ModelViewSet):
    """
        CRUD to manage vulnerabilities.
    """
    queryset = Vulnerability.objects.all().order_by('last_updated_date')  # type: ignore
    permissions = [
        permissions.IsAuthenticated,
        IsLinkedToData,
        IsFreelancer | IsPentester | IsManager & ReadOnly,
    ]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnerabilitySerializer

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

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id

        vuln = request.data.get('vuln_type')
        if not vuln:
            return Response({
                'errors': 'missing "vuln_type" field',
            }, status=HTTP_400_BAD_REQUEST)

        vuln_obj = VulnType.objects.filter(name=vuln).first()  # type: ignore
        if not vuln_obj:
            return Response({
                'errors': 'unknown "vuln_type" type',
            }, status=HTTP_400_BAD_REQUEST)

        request.data['vuln_type'] = vuln_obj.id
        if 'description' not in request.data:
            request.data['description'] = vuln_obj.description

        if 'images' in request.data:
            nb_images = min(len(request.data['images']), 4)
            for n in range(nb_images):
                request.data['images'][n] = S3Bucket().upload_single_image(request.data['images'][n])

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'author' in request.data:
            request.data.pop('author')

        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id

        if 'vuln_type' in request.data:
            vuln_obj = VulnType.objects.filter(name=request.data['vuln_type']).first()  # type: ignore
            if not vuln_obj:
                return Response({
                    'errors': 'unknown "vuln_type" type',
                }, status=HTTP_400_BAD_REQUEST)
            request.data['vuln_type'] = vuln_obj.id
            if not 'description' in request.data:
                request.data['description'] = vuln_obj.description

        if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
            request.data['images'] = []
            return super().update(request, *args, **kwargs)

        if 'images' in request.data:
            nb_images = min(len(request.data['images']), 4)
            for n in range(nb_images):
                request.data['images'][n] = S3Bucket().upload_single_image(request.data['images'][n])

        return super().update(request, *args, **kwargs)
