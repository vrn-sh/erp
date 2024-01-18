# ViewSet for the clientInfos table

from rest_framework import viewsets
from rest_framework import permissions
from knox.auth import TokenAuthentication
from rest_framework.views import Response
from api.models import Auth

from api.models.client_infos import ClientInfo
from api.permissions import IsManager, IsLinkedToData, IsPentester, ReadOnly

from api.serializers.client_infos import ClientInfoSerializer


class ClientInfoViewset(viewsets.ModelViewSet):
    """CRUD for clientInfos object"""

    queryset = ClientInfo.objects.all()  # type: ignore
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated & IsManager | permissions.IsAuthenticated & IsLinkedToData | permissions.IsAuthenticated & IsPentester & ReadOnly]
    serializer_class = ClientInfoSerializer

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data['last_editor'] = request.user.id
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        client_infos = ClientInfo.objects.filter(mission__team__members__id=request.user.id)
        self.queryset = client_infos
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
