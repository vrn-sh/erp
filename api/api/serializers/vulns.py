from datetime import datetime
from warnings import warn

from django.db import transaction
from rest_framework import serializers
from api.models import Auth

from api.models.vulns import Notes, VulnType, ImageModel, Vulnerability
from api.serializers import AuthSerializer
from api.serializers.mission import MissionSerializer
from api.serializers.utils import create_instance


class NotesSerializer(serializers.ModelSerializer):
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
    images = ImageSerializer(read_only=True, many=True) # TODO: set read_only=True when s3 is supported

    class Meta:
        model = Vulnerability
        fields = '__all__'
