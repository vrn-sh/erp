from typing import List
from warnings import warn

from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.views import Response
from api.models import Auth


from api.models.vulns import ImageModel, Notes, VulnType, Vulnerability
from api.permissions import IsManager, IsOwner, IsPentester

from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer


class NotesViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsManager | IsOwner] # FIXME(adina): add isPartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = NotesSerializer

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        if "author" in request.data:
            request.data.pop("author")

        request.data["last_editor"] = request.user.id
        return super().update(request, *args, **kwargs)


class VulnTypeViewset(viewsets.ModelViewSet):
    """
        CRUD to add a new vulnerability type. Shouldn't happen often, but still.
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
    permissions = [permissions.IsAuthenticated & IsOwner & IsPentester]  # FIXME(adina): add is PartOfTheTeam
    authentication_classes = [TokenAuthentication]
    serializer_class = VulnerabilitySerializer

    @staticmethod
    def set_images(data: dict[str, str]) -> List[ImageModel]:
        """gets or creates image from request data"""
        images: List[ImageModel] = []

        for img_data in data['images']:
            images.append(ImageModel.objects.get_or_create(img_data))  # FIXME(adina): make this suck less

        return images

    def create(self, request, *args, **kwargs):
        request.data['author'] = request.user.id
        request.data['last_editor'] = request.user.id

        vuln_name = request.data.get('vuln_type', None)
        if not vuln_name:
            return Response({
                'errors': 'missing field: vuln_type',
                }, status=HTTP_400_BAD_REQUEST)

        request.data['vuln_type'] = VulnType.objects.filter(name=vuln_name).first()
        if not request.data.get('vuln_type'):
            return Response({
                'errors': 'unknown vulnerability type',
            }, status=HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data['last_editor'] = request.user.id
        return super().update(request, *args, **kwargs)
