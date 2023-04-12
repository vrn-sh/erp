from datetime import datetime
from warnings import warn
from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.routers import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from api.models.mission import Mission, NmapScan, Recon
from api.permissions import IsManager, IsOwner, IsPentester, ReadOnly
from api.serializers.mission import MissionSerializer, NmapSerializer, ReconSerializer
from api.models.utils import parse_nmap_ips, parse_nmap_domain, parse_nmap_scan


class NmapViewset(viewsets.ModelViewSet):
    """
        CRUD for Nmap scan object
    """
    queryset = NmapScan.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = NmapSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsManager & ReadOnly | IsPentester]

    def create(self, request, *args, **kwargs):
        fields = {
                'ips': parse_nmap_ips,
                'domain': parse_nmap_domain,
                'ports': parse_nmap_scan,
        }

        for field, func in fields.items():
            result = func(request.data.get('nmap_file', ''))
            if not result:
                Response({'error': f'error running {func.__name__}'}, status=HTTP_400_BAD_REQUEST)
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

        for field, func in fields.items():
            result = func(request.data.get('nmap_file', ''))
            if not result:
                Response({'error': f'error running {func.__name__}'}, status=HTTP_400_BAD_REQUEST)
            data[field] = result

        serializer = self.get_serializer(instance, data=data, partial=False)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        return Response(self.get_serializer(instance).data)


class ReconViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
        CRUD for Recon object
    """

    queryset = Recon.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = ReconSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner, IsManager & ReadOnly | IsPentester]


class MissionViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors
    """
        CRUD for mission object
    """

    queryset = Mission.objects.all()
    permission_classes = [permissions.IsAuthenticated,  IsOwner, IsPentester & ReadOnly | IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = MissionSerializer

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
