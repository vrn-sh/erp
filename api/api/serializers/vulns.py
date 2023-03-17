from warnings import warn

from rest_framework import serializers

from api.models.vulns import Notes, VulnType, ImageModel, Vulnerability
from api.serializers import create_instance, AuthSerializer


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'content', 'creation_date', 'last_updated_date', 'author'
        ]
        model = Notes

        def to_representation(self, instance):

            author = instance.pop('author')
            serializer = AuthSerializer(author)
            instance["author"] = serializer.data
            super().to_representation(instance)


class VulnTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'name', 'description'
        ]
        model = VulnType


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'image'
        ]
        model = ImageModel


class VulnerabilitySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=False, required=False)

    class Meta:
        fields = [
            'id', 'title', 'description', 'images', 'author', 'last_editor', 'vuln_type'
        ]

        model = Vulnerability
