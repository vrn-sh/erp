from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.models.mission import Mission, Recon
from api.permissions import IsManager, IsPentester, ReadOnly
from api.serializers.mission import MissionSerializer, ReconSerializer


class ReconViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors
    """
        CRUD for Recon object
    """

    # FIXME(adina): add isPartOfTheTeam
    queryset = Recon.objects.all()
    authentication_classes = [TokenAuthentication]
    serializer_class = ReconSerializer
    permission_classes = [permissions.IsAuthenticated, IsPentester | ReadOnly]


class MissionViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors

    """
        CRUD for mission object
    """

    # FIXME(adina): add isPartOfTheTeam
    queryset = Mission.objects.all()
    permission_classes = [permissions.IsAuthenticated,  IsManager | ReadOnly]
    authentication_classes = [TokenAuthentication]
    serializer_class = MissionSerializer

    def create(self, request, *args, **kwargs):
        request.data['created_by'] = request.user.id
        request.data['last_updated_by'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        if "created_by" in request.data:
            request.data.pop("created_by")

        request.data["last_updated_by"] = request.user.id
        return super().update(request, *args, **kwargs)
