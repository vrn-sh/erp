from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.backends import EmailBackend
from api.models.vulns import Notes, VulnType, Vulnerability
from api.permissions import IsAdmin, IsOwner
from api.serializers import AuthSerializer

from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer


class NotesViewset(viewsets.ModelViewSet): # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsAdmin | IsOwner] # FIXME(adina): add isPartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer

    def create(self, request, *args, **kwargs):
        author = EmailBackend().get_user_by_email(request.user.email)
        serialized_author = AuthSerializer(data=author, read_only=True, many=False)
        if serialized_author.is_valid():
            print(serialized_author.errors)
            request.data["author"] = serialized_author.validated_data
            request.data["last_editor"] = serialized_author.validated_data
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        last_editor = EmailBackend().get_user_by_email(request.user.email)
        serialized_last_editor = AuthSerializer(data=last_editor, read_only=True, many=False)
        if serialized_last_editor.is_valid():
            request.data["last_editor"] = serialized_last_editor.data
        return super().update(request, *args, **kwargs)

class VulnTypeViewset(viewsets.ModelViewSet):
    """
        Crud to add a new vulnerability type. Shouldn't happen often, but still.
    """
    queryset = VulnType.objects.all()
    permissions = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnTypeSerializer


class VulnerabilityViewset(viewsets.ModelViewSet):
    """
        CRUD to manage vulnerabilities.
    """
    queryset = Vulnerability.objects.all()
    permissions = [permissions.IsAuthenticated & IsOwner] # FIXME(adina): add is PartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnerabilitySerializer
