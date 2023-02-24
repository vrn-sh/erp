from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.models.NotesModel import Notes
from api.permissions import IsAdmin, IsOwner
from api.serializers.NotesSerializer import NotesSerializer


class NotesViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsAdmin | IsOwner] # fixme (adina) (add isPartOfTheTeam)
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer
    