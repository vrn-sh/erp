from typing import List
from warnings import warn

from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication

from api.models.vulns import ImageModel, Notes, VulnType, Vulnerability
from api.permissions import IsAdmin, IsOwner, IsPentester

from api.serializers.vulns import NotesSerializer, VulnTypeSerializer, VulnerabilitySerializer


class NotesViewset(viewsets.ModelViewSet):  # pylint: disable=too-many-ancestors

    """
        CRUD for notes object
    """

    queryset = Notes.objects.all()
    permission_classes = [permissions.IsAuthenticated & IsAdmin | IsOwner]  # FIXME(adina): add isPartOfTheTeam
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
        if 'images' in request.data:
            request.data['images'] = [i.id for i in self.set_images(request.data)]
        if "vuln_type" in request.data:
            request.data["vuln_type"] = VulnType.objects.get(name=request.data["vuln_type"]).id
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'author' in request.data:
            request.data.pop("author")

        request.data['last_editor'] = request.user.id
        if 'images' in request.data:
            request.data['images'] = [i.id for i in self.set_images(request.data)]
        if "vuln_type" in request.data:
            request.data["vuln_type"] = VulnType.objects.get(name=request.data["vuln_type"]).id
        return super().update(request, *args, **kwargs)
