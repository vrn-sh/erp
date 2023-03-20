from warnings import warn

from rest_framework import serializers
from api.models import Auth

from api.models.vulns import Notes, VulnType, ImageModel, Vulnerability
from api.serializers import AuthSerializer
from api.serializers.mission import MissionSerializer


class NotesSerializer(serializers.ModelSerializer):
    author = AuthSerializer(read_only=True, many=False)
    mission = MissionSerializer(read_only=False, many=False)

    class Meta:
        model = Notes
        fields = [
            'id', 'content', 'creation_date', 'last_updated', 'author', 'mission'
        ]

class VulnTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VulnType
        fields = [
            'id', 'name', 'description'
        ]

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = [
            'image'
        ]

class VulnerabilitySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=False)
    vuln_type = VulnTypeSerializer(many=False, read_only=False)
    author = AuthSerializer(read_only=True, many=False)

    class Meta:
        model = Vulnerability
        fields = [
            'id', 'title', 'description', 'images',
            'author', 'last_editor', 'vuln_type',
            'serverity'
        ]

