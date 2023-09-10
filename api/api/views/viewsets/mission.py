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
from django.core.cache import cache
from rest_framework.routers import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from api.models import Auth, Pentester

from api.models.mission import Credentials, Mission, NmapScan, Recon, CrtSh
from api.permissions import IsManager, IsLinkedToData, IsPentester, ReadOnly
from api.serializers.mission import CredentialsSerializer, MissionSerializer, NmapSerializer, ReconSerializer
from api.models.utils import parse_nmap_ips, parse_nmap_domain, parse_nmap_scan, default_nmap_output

from api.services.crtsh import fetch_certificates_from_crtsh


class NmapViewset(viewsets.ModelViewSet):
    """
        CRUD for Nmap scan object
    """
    queryset = NmapScan.objects.all()  # type: ignore
    authentication_classes = [TokenAuthentication]
    serializer_class = NmapSerializer
    permission_classes = [permissions.IsAuthenticated , IsLinkedToData, IsManager & ReadOnly | IsPentester]

    @swagger_auto_schema(
        operation_description="Creates and parses an NMAP output object.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['recon_id', 'nmap_file'],
            properties={
                'recon_id': openapi.Schema(type=openapi.TYPE_INTEGER,
                                           description="Id of recon"),
                'nmap_file': openapi.Schema(type=openapi.TYPE_STRING,
                                      description="Nmap output.", default=default_nmap_output),
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
        fields = {
            'ips': parse_nmap_ips,
            'domain': parse_nmap_domain,
            'ports': parse_nmap_scan,
        }

        for field, func in fields.items():
            result = func(request.data.get('nmap_file', ''))
            if result == [] or result is None:
                return Response({'error': f'error running {func.__name__}'}, status=HTTP_400_BAD_REQUEST)
            request.data[field] = result

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

        fields = {
            'ips': parse_nmap_ips,
            'domain': parse_nmap_domain,
            'ports': parse_nmap_scan,
        }

        data = {}
        # this will just error in the serializer if input is not provided
        data['recon'] = request.data.get('recon_id', 0)

        for field, func in fields.items():
            result = func(request.data.get('nmap_file', ''))
            if not result:
                Response({'error': f'error running {func.__name__}'}, status=HTTP_400_BAD_REQUEST)
            data[field] = result

        serializer = self.get_serializer(instance, data=data, partial=False)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(self.get_serializer(instance).data)


class ReconViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for Recon object
    """

    queryset = Recon.objects.all()  # type: ignore
    authentication_classes = [TokenAuthentication]
    serializer_class = ReconSerializer
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData, IsManager & ReadOnly | IsPentester]


class CrtShView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, IsPentester]

    @staticmethod
    def has_crtsh_error(response: List[Dict[str, Any]]) -> bool:
        """checks if there is an error returned from crtsh.py"""
        return len(response) == 1 and 'error' in response[0]

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
    def post(self, request, *args, **kwargs):
        mission_id = request.query_params.get('mission_id')
        domain = request.query_params.get('domain')

        if not mission_id or not domain:
            return Response({
                "error": "Domain and mission_id parameters are required.",
            }, status=HTTP_400_BAD_REQUEST)

        # getting related mission
        mission = Mission.objects.filter(id=mission_id).first()  # type: ignore
        if not mission:
            return Response({
                "error": "Mission not found",
            }, status=HTTP_400_BAD_REQUEST)

        current_user: Pentester = Pentester.objects.get(auth__id=request.user.id)  # type: ignore
        if current_user not in mission.team.members.all():
            return Response({
                'error': 'user not member of mission',
            }, status=HTTP_400_BAD_REQUEST)

        # if CrtSh already exists, no need to recreate it
        crt_object = CrtSh.objects.filter(recon_id=mission.recon.id).first()  # type: ignore
        if not crt_object:
            certificates = fetch_certificates_from_crtsh(domain)
            crt_object = CrtSh.objects.create(recon_id=mission.recon.id, dump=dumps(certificates, default=str))  # type: ignore
            crt_object.save()

            status = HTTP_201_CREATED
            if self.has_crtsh_error(certificates):
                status = HTTP_500_INTERNAL_SERVER_ERROR

            # return json parsed data
            return Response({'dump': certificates}, status=status)

        status = HTTP_201_CREATED
        if self.has_crtsh_error(loads(crt_object.dump)):
            status = HTTP_500_INTERNAL_SERVER_ERROR

        return Response({'dump': loads(crt_object.dump)}, status)


    @swagger_auto_schema(
        operation_description="Fetches certificates for a given domain and updates the mission data.",
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
            "200": openapi.Response(
                description="200 OK",
            ),
            "400": openapi.Response(
                description="400 Bad Request",
            )
        },
        security=['Bearer'],
        tags=['crt.sh'],
    )
    def patch(self, request, *args, **kwargs):
        mission_id = request.query_params.get('mission_id')
        domain = request.query_params.get('domain')

        if not mission_id or not domain:
            return Response({
                "error": "Domain and mission_id parameters are required.",
            }, status=HTTP_400_BAD_REQUEST)

        # getting related mission
        mission = Mission.objects.filter(id=mission_id).first()  # type: ignore
        if not mission:
            return Response({
                "error": "Mission not found",
            }, status=HTTP_400_BAD_REQUEST)

        current_user: Pentester = Pentester.objects.get(auth__id=request.user.id)  # type: ignore
        if current_user not in mission.team.members.all():
            return Response({
                'error': 'user not member of mission',
            }, status=HTTP_400_BAD_REQUEST)

        certificates = fetch_certificates_from_crtsh(domain)

        # if CrtSh already exists, no need to recreate it
        crt_object = CrtSh.objects.filter(recon_id=mission.recon.id).first()  # type: ignore
        if not crt_object:
            crt_object = CrtSh.objects.create(recon_id=mission.recon.id, dump=dumps(certificates, default=str))  # type: ignore
            crt_object.save()

            status = HTTP_200_OK
            if self.has_crtsh_error(certificates):
                status = HTTP_500_INTERNAL_SERVER_ERROR

            # return json parsed data
            return Response({'dump': certificates}, status=status)

        crt_object.dump = dumps(certificates, default=str)
        crt_object.save()

        status = HTTP_200_OK
        if self.has_crtsh_error(certificates):
            status = HTTP_500_INTERNAL_SERVER_ERROR

        return Response({'dump': certificates}, status)


class CredentialViewset(viewsets.ModelViewSet):
    """CRUD operation to add credentials to a mission"""

    queryset = Credentials.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData]
    authentication_classes = [TokenAuthentication]
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

        mission_id = request.data.get('mission_id', 0)
        if mission := Mission.objects.filter(id=mission_id).first():

            if not mission.is_member(self.request.user):
                return Response(HTTP_403_FORBIDDEN)

            creds = Credentials.objects.filter(mission_id=mission_id)  # type: ignore

             # Apply pagination to the queryset
            page = self.paginate_queryset(creds)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = self.get_serializer(creds, many=True)
            return Response(serializer.data)

        return Response({'error': 'unknown mission'}, HTTP_404_NOT_FOUND)

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
                    type=openapi.TYPE_INTEGER,
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
                }
            )
        },
        security=['Bearer'],
        tags=['credentials'],
    )
    def create(self, request, *args, **kwargs):
        mission_id = request.data.get('mission_id', 0)
        if mission := Mission.objects.filter(id=mission_id).first():

            if not mission.is_member(self.request.user):
                return Response(HTTP_403_FORBIDDEN)

            request.data['mission'] = mission
            return super().create(request, *args, **kwargs)

        return Response({'error': 'unknown mission'}, HTTP_404_NOT_FOUND)


class MissionViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for mission object
    """

    queryset = Mission.objects.all()  # type: ignore
    permission_classes = [permissions.IsAuthenticated, IsLinkedToData, IsPentester & ReadOnly | IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = MissionSerializer

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
                'team': openapi.Schema(
                    type=openapi.TYPE_INTEGER,
                    description="Id of the team",
                ),
                'scope': openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    description="list of IP addresses or domain names",
                )
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "title": "Pentest mission",
                    "start": "2020-06-03",
                    "end": "2022-06-03",
                    "team": 1,
                    "scopes": ["*.djnn.sh", "10.10.0.1/24"],
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
        request.data['created_by'] = request.user.id
        request.data['last_updated_by'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "created_by" in request.data:
            request.data.pop("created_by")

        request.data["last_updated_by"] = request.user.id
        return super().update(request, *args, **kwargs)


# class WappalyzerRequestView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [TokenAuthentication]

#     def post(self, request, *args, **kwargs):
#         url = request.GET.get('url')

#         cached = cache.get(url)
#         if cached:
#             cache.set(f'WAPPALYZER-{url}', cached, 60 * 15)
#             return Response(cached)

#         wapp_api_url = 'http://localhost:4000/run' \
#                 if os.environ.get('IN_CONTAINER', '0') == '0' \
#                 else 'http://wapp-api:4000/run'

#         result = requests.post(f'{wapp_api_url}?url={url}', timeout=20.0)
#         if result.status_code != 200:
#             return Response(status=HTTP_500_INTERNAL_SERVER_ERROR)

#         as_json = result.json()
#         cache.set(f'WAPPALYZER-{url}', as_json, 60 * 15)

#         return Response(as_json)
class WappalyzerRequestView(APIView):
     authentication_classes = [TokenAuthentication]
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

