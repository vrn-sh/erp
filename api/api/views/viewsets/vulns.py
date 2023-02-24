from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.models.vulns import Notes
from api.permissions import IsAdmin, IsOwner
from api.serializers.vulns import NotesSerializer


class NotesViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsAdmin | IsOwner] # FIXME(adina): add isPartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer
