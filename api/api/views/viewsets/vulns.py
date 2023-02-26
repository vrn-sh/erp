from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.models.vulns import Notes, VulnType, Vulnerability
from api.permissions import IsAdmin, IsOwner


from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer


class NotesViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsAdmin | IsOwner] # FIXME(adina): add isPartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer

class VulnTypeViewset(viewsets.ModelViewSet):
    """
        Crud to add a new vulnerability type. Shouldn't happen often, but still.
    """
    queryset = VulnType.objects.all()
    permissions = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnTypeSerializer


class VulnerabilityViewset(viewsets.ModelViewSet):
    queryset = Vulnerability.objects.all()
    permissions = [permissions.IsAuthenticated & IsAdmin | IsOwner] # FIXME(adina): add is PartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnerabilitySerializer
