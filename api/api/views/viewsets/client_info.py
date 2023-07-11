# ViewSet for the clientInfos table

from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import Response
from api.models import Auth

from api.models.client_infos import ClientInfo
from api.permissions import IsManager, IsLinkedToData, IsPentester, ReadOnly

from api.serializers.client_infos import ClientInfoSerializer


class ClientInfoViewset(viewsets.ModelViewSet):
    """CRUD for clientInfos object"""

    queryset = ClientInfo.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsManager | permissions.IsAuthenticated & IsLinkedToData]
    authentication_classes = [TokenAuthentication]
    serializer_class = ClientInfoSerializer

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data['last_editor'] = request.user.id
        return super().update(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        if request.user.is_manager:
            return super().list(request, *args, **kwargs)
        else:
            queryset = ClientInfo.objects.filter(mission__pentester=request.user.id)
            serializer = ClientInfoSerializer(queryset, many=True)
            return Response(serializer.data)
    
    def retrieve(self, request, *args, **kwargs):
        if request.user.is_manager:
            return super().retrieve(request, *args, **kwargs)
        else:
            queryset = ClientInfo.objects.filter(mission__pentester=request.user.id)
            serializer = ClientInfoSerializer(queryset, many=True)
            return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        if request.user.is_manager:
            return super().destroy(request, *args, **kwargs)
        else:
            return Response(status=403)
