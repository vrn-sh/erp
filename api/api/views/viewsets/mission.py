from datetime import datetime
from warnings import warn

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from knox.auth import TokenAuthentication
from rest_framework.routers import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from api.models.mission import Mission, NmapScan, Recon, CrtSh
from api.permissions import IsManager, IsOwner, IsPentester, ReadOnly
from api.serializers.mission import MissionSerializer, NmapSerializer, ReconSerializer, CrtShSerializer
from api.models.utils import parse_nmap_ips, parse_nmap_domain, parse_nmap_scan, default_nmap_output


class NmapViewset(viewsets.ModelViewSet):
    """
        CRUD for Nmap scan object
    """
    queryset = NmapScan.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = NmapSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsManager & ReadOnly | IsPentester]

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

    queryset = Recon.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = ReconSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsManager & ReadOnly | IsPentester]

class CrtShViewSet(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    queryset = CrtSh.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = CrtShSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsManager & ReadOnly | IsPentester]

class MissionViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for mission object
    """

    queryset = Mission.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsPentester & ReadOnly | IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = MissionSerializer

    @swagger_auto_schema(
        operation_description="Creates a mission. Must be done by a Manager.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['start', 'end', 'team'],
            properties={
                'start': openapi.Schema(type=openapi.FORMAT_DATE,
                                        description="date of mission start"),
                'end': openapi.Schema(type=openapi.FORMAT_DATE,
                                      description="date of mission ends"),
                'title': openapi.Schema(type=openapi.TYPE_STRING,
                                        description="Title of the mission"),
                'team': openapi.Schema(type=openapi.TYPE_INTEGER,
                                       description="Id of the team")
            },
        ),
        responses={
            "200": openapi.Response(
                description="200 OK",
                examples={
                    "id": 1,
                    "title": "Pentest Epitech",
                    "start": "2020-06-03",
                    "end": "2022-06-03",
                    "team": 2
                }
            )
        },
        security=['Bearer'],
        tags=['mission'],
    )
    def create(self, request, *args, **kwargs):
        request.data['created_by'] = request.user.id
        request.data['last_updated_by'] = request.user.id
        request.data['recon'] = Recon.objects.create()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "created_by" in request.data:
            request.data.pop("created_by")

        request.data["last_updated_by"] = request.user.id
        return super().update(request, *args, **kwargs)
