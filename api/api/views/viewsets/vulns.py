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
        request.data.pop("author", None)
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

        vuln = request.data.get('vuln_type')
        if not vuln:
            return Response({
                'errors': 'missing "vuln_type" field',
            }, status=HTTP_400_BAD_REQUEST)

        vuln_obj = VulnType.objects.filter(name=vuln).first()
        if not vuln_obj:
            return Response({
                'errors': 'unknown "vuln_type" type',
            }, status=HTTP_400_BAD_REQUEST)

        request.data['vuln_type'] = vuln_obj.id
        if not 'description' in request.data:
            request.data['description'] = vuln_obj.description
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if 'author' in request.data:
            request.data.pop('author')
        request.data['last_editor'] = request.user.id

        if 'vuln_type' in request.data:
            vuln_obj = VulnType.objects.filter(name=request.data['vuln_type']).first()
            if not vuln_obj:
                return Response({
                    'errors': 'unknown "vuln_type" type',
                }, status=HTTP_400_BAD_REQUEST)
            request.data['vuln_type'] = vuln_obj.id
            if not 'description' in request.data:
                request.data['description'] = vuln_obj.description

        return super().update(request, *args, **kwargs)
