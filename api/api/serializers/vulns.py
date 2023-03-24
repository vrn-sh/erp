from datetime import datetime
from warnings import warn

from rest_framework import serializers
from api.models import Auth

from api.models.vulns import Notes, VulnType, ImageModel, Vulnerability
from api.serializers import AuthSerializer
from api.serializers.mission import MissionSerializer
from api.serializers.utils import create_instance


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
    images = ImageSerializer(many=True, read_only=True) # FIXME(djnn): set back to True once s3 is supported
    vuln_type = VulnTypeSerializer(many=False, read_only=True)
    author = AuthSerializer(many=False, read_only=True)

    class Meta:
        model = Vulnerability
        fields = '__all__'

    def create(self, validated_data):
        validated_data['author'] = validated_data["last_editor"]
        warn(f'validated data: {validated_data}')

        if "creation_date" not in validated_data:
            validated_data["creation_date"] = datetime.now()
            validated_data["last_updated_date"] = datetime.now()

        if "last_editor" not in validated_data:
            validated_data["last_editor"] = validated_data["author"]

        if "images" in validated_data:
            images = create_instance(ImageSerializer, validated_data, "images")
            return Vulnerability.objects.create(images=images, **validated_data)

        return Vulnerability.objects.create(**validated_data)
