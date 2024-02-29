from datetime import datetime
from json import dumps, loads
import json
from typing import Any, Dict, List
from warnings import warn

import os
import requests

from drf_yasg import openapi
from drf_yasg.utils import APIView, swagger_auto_schema
from rest_framework import viewsets, permissions
from knox.auth import TokenAuthentication
from rest_framework.routers import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from api.models import USER_ROLES, Pentester

from api.models.mission import Credentials, Mission, NmapScan, Recon, CrtSh
from api.permissions import IsFreelancer, IsManager, IsLinkedToData, IsPentester, ReadOnly
from api.serializers.mission import CredentialsSerializer, MissionSerializer, NmapSerializer, ReconSerializer
from api.models.utils import NmapParser, minimal_nmap_output
from api.services.s3 import S3Bucket

from django.http import JsonResponse
from api.services.crtsh import crtshAPI
from django.core.cache import cache
from django.db.models import Q
from rest_framework.permissions import AllowAny


class NmapViewset(viewsets.ModelViewSet):
    """
        CRUD for Nmap scan object
    """
    queryset = NmapScan.objects.all()  # type: ignore
    authentication_classes = []
    serializer_class = NmapSerializer
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData,
                          IsManager & ReadOnly | IsPentester | IsFreelancer]

    @swagger_auto_schema(
        operation_description="Creates and parses an NMAP output object.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['recon_id', 'nmap_file'],
            properties={
                'recon_id': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Recon object ID"
                ),
                'nmap_file': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Nmap output.", default=minimal_nmap_output
                ),
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "recon_id": 4,
                    "ips": ["127.0.0.1", "0.0.0.0"],
                    "ports": ["8080,http,up,django"]
                }
            )
        },
        security=['Bearer'],
        tags=['NMAP'],
    )
    def create(self, request, *args, **kwargs):

        parser = NmapParser()
        if file := request.data.get('nmap_file'):

            if not parser.run(file):
                return Response({'error': 'invalid nmap file'}, status=HTTP_400_BAD_REQUEST)

            request.data['ips'] = parser.ip_addrs
            request.data['ports'] = parser.ports
            request.data['nmap_version'] = parser.version_nmap
            request.data['scan_date'] = parser.scan_date

            if parser.os_details:
                request.data['os_details'] = parser.os_details

            if recon_id := request.data.get('recon_id'):
                recon, _ = Recon.objects.get_or_create(
                    id=recon_id)  # type: ignore

                if '1' not in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
                    cache.delete(f'mission_{recon.mission.id}')

        # this will just error in the serializer if input is not provided
        request.data['recon'] = request.data.get('recon_id', 0)
        request.data['creation_timestamp'] = datetime.now()
        request.data.pop('nmap_file', None)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        return Response(self.get_serializer(instance).data, status=HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        data = {}
        # this will just error in the serializer if input is not provided
        data['recon'] = request.data.get('recon_id', 0)

        parser = NmapParser()
        if file := request.data.get('nmap_file'):

            if not parser.run(file):
                return Response({'error': 'invalid nmap file'}, status=HTTP_400_BAD_REQUEST)

            request.data['ips'] = parser.ip_addrs
            request.data['ports'] = parser.ports
            request.data['nmap_version'] = parser.version_nmap
            request.data['scan_date'] = parser.scan_date

            if parser.os_details:
                request.data['os_details'] = parser.os_details

            request.data.pop('nmap_file')

        serializer = self.get_serializer(instance, data=data, partial=False)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(self.get_serializer(instance).data)


class ReconViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for Recon object
    """

    queryset = Recon.objects.all()  # type: ignore
    authentication_classes = []
    serializer_class = ReconSerializer
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData,
                          IsManager & ReadOnly | IsPentester | IsFreelancer]


class CrtShView(APIView):
    CACHE_TIMEOUT = 3600  # Set your desired cache timeout in seconds

    @swagger_auto_schema(
        operation_description="Fetches certificates for a given domain and saves them to a mission.",
        manual_parameters=[
            openapi.Parameter(
                name="mission_id",
                in_=openapi.IN_QUERY,
                description="ID of the mission to save the certificates.",
                required=True,
                type=openapi.TYPE_INTEGER,
            ),
            openapi.Parameter(
                name="domain",
                in_=openapi.IN_QUERY,
                description="domain name to check.",
                required=True,
                type=openapi.TYPE_INTEGER,
            )
        ],
        responses={
            "201": openapi.Response(
                description="201 Created",
            ),
            "400": openapi.Response(
                description="400 Bad Request",
            )
        },
        security=['Bearer'],
        tags=['crt.sh'],
    )
    def get(self, request):
        domain = request.GET.get('domain')

        if not domain:
            return JsonResponse({"error": "Domain parameter is missing."}, status=400)

        cached_data = cache.get(domain)
        if cached_data:
            return JsonResponse(cached_data, safe=False)

        data = crtshAPI().search(domain)

        crtsh_data_list = []

        for item in data:
            crtsh_data = {
                "id": item.get("id"),
                "logged_at": item.get("entry_timestamp"),
                "not_before": item.get("not_before"),
                "not_after": item.get("not_after"),
                "name": item.get("name_value"),
                "ca": dict(
                    (name.split("=") if "=" in name else (name, None))
                    for name in item.get("issuer_name", "").split(",")
                ),
            }
            crtsh_data_list.append(crtsh_data)
        cache.set(domain, crtsh_data_list, self.CACHE_TIMEOUT)
        return JsonResponse(crtsh_data_list, safe=False)


class CredentialViewset(viewsets.ModelViewSet):
    """CRUD operation to add credentials to a mission"""

    queryset = Credentials.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData]
    authentication_classes = []
    serializer_class = CredentialsSerializer

    @swagger_auto_schema(
        operation_description="Lists all Credentials for a mission",
        manual_parameters=[
            openapi.Parameter(
                name="mission_id",
                in_=openapi.IN_QUERY,
                description="ID of the mission to save the certificates.",
                required=True,
                type=openapi.TYPE_INTEGER,
            )
        ],
        responses={
            "200": openapi.Response(
                description="200 OK",
            ),
            "400": openapi.Response(
                description="400 Bad Request",
            )
        },
        security=['Bearer'],
        tags=['credentials'],
    )
    def list(self, request, *args, **kwargs):

        mission_id = request.query_params.get('mission_id', 0)

        creds = Credentials.objects.filter(mission=mission_id)  # type: ignore
        warn(f'creds: {creds}')

        # Apply pagination to the queryset
        page = self.paginate_queryset(creds)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(creds, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Creates a Credential model",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['mission_id', 'login', 'password', 'service'],
            properties={
                'login': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="username",
                ),
                'password': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="credential password",
                ),
                'service': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="service the credential is linked to",
                ),
                'mission_id': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="mission ID of the related credential",
                ),
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "login": "example@epitech.eu",
                    "password": "s3cr37P4ssw0rd",
                    "service": "https://intra.epitech.eu",
                    "comment": "student account -- no admin privs",
                    "mission_id": "0",
                }
            )
        },
        security=['Bearer'],
        tags=['credentials'],
    )
    def create(self, request, *args, **kwargs):
        mission_id = request.data.get('mission_id', 0)

        # type: ignore
        if mission := Mission.objects.filter(id=mission_id).first():

            if self.request.user.role != 3 and not mission.is_member(self.request.user):
                return Response(status=HTTP_403_FORBIDDEN)
            request.data['mission'] = mission_id
            return super().create(request, *args, **kwargs)

        return Response({'error': 'unknown mission'}, status=HTTP_404_NOT_FOUND)


class MissionViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for mission object
    """

    queryset = Mission.objects.all()  # type: ignore
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = MissionSerializer

    CACHE_KEY_PREFIX = 'mission_'
    CACHE_TIMEOUT = 60 * 60 * 24  # 24 hours

    @swagger_auto_schema(
        operation_description="Creates a mission. Must be done by a Manager.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['start', 'end', 'team', 'scope'],
            properties={
                'start': openapi.Schema(
                    type=openapi.FORMAT_DATE,
                    description="date of mission start",
                ),
                'end': openapi.Schema(
                    type=openapi.FORMAT_DATE,
                    description="date of mission ends",
                ),
                'title': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Title of the mission",
                ),
                'logo': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="token of the logo",
                ),
                'team': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Id of the team",
                ),
                'scope': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description="list of IP addresses or domain names",
                ),
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "title": "Pentest mission",
                    "logo": "token of the logo",
                    "start": "2020-06-03",
                    "end": "2022-06-03",
                    "team": 1,
                    "scopes": ["*.djnn.sh", "10.10.0.1/24"],
                    "status": "In progress",
                    "recon": {
                        "nmap": []
                    }
                }
            )
        },
        security=['Bearer'],
        tags=['mission'],
    )
    def create(self, request, *args, **kwargs):
        request.data['created_by'] = 7
        request.data['last_updated_by'] = 7

        if not 'team' in request.data:
            if USER_ROLES[request.user.role] == 'freelancer':

                request.data['team'] = None
                request.data['freelance_member'] = request.user.id
            else:
                return Response({
                    'error': 'please specify team',
                }, status=HTTP_400_BAD_REQUEST)
        if 'logo' in request.data and '1' not in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            token = S3Bucket().upload_single_image_if_exists(
                'logo',
                request.data
            )
            request.data['logo'] = token

        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        Retrieve a list of missions based on the request parameters.

        Args:
            request (HttpRequest): The HTTP request object.
            *args: Variable length argument list.
            **kwargs: Arbitrary keyword arguments.

        Returns:
            Response: The HTTP response containing the list of missions.
        """
        name_query = request.query_params.get('search', None)

        # Filter missions created by user with id 7
        missions = Mission.objects.filter(created_by=7)

        if name_query:
            missions = missions.filter(title=name_query)

        self.queryset = missions
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "created_by" in request.data:
            request.data.pop("created_by")
        if "logo" in request.data:
            token = S3Bucket().upload_single_image_if_exists(
                'logo',
                request.data
            )
            request.data['logo'] = token
        request.data["last_updated_by"] = request.user.id
        return super().update(request, *args, **kwargs)


class WappalyzerRequestView(APIView):
    authentication_classes = []
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):

        sets = 'security,meta,locale,events'
        urls = request.GET.get('urls')

        # TODO(djnn): add rate-limit per user per day

        data = requests.get(
            f'https://api.wappalyzer.com/v2/lookup?urls={urls}&sets={sets}',
            timeout=2.0,
            headers={
                "x-api-key": os.environ['WAPPALYZER_API_KEY'],
            }
        )

        return Response(data.json(), status=HTTP_200_OK)
