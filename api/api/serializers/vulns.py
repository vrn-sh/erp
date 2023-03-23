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
        fields = '__all__'


class VulnTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VulnType
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageModel
        fields = '__all__'


class VulnerabilitySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=False)
    vuln_type = VulnTypeSerializer(many=False, read_only=False)
    author = AuthSerializer(many=False, read_only=True)

    class Meta:
        model = Vulnerability
        fields = '__all__'


