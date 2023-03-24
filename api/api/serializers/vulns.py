from datetime import datetime
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
        model = Vulnerability
        fields = [
            'id', 'title', 'description', 'images', 'author', 'last_editor', 'vuln_type'
        ]

    def create(self, validated_data):

        if "creation_date" not in validated_data:
            validated_data["creation_date"] = datetime.now()
            validated_data["last_updated_date"] = datetime.now()

        if "last_editor" not in validated_data:
            validated_data["last_editor"] = validated_data["author"]

        validated_data["vuln_type"] = VulnType.objects.get(name=validated_data["vuln_type"])
        if "images" in validated_data:
            images = create_instance(ImageSerializer, validated_data, "images")
            return Vulnerability.objects.create(images=images, **validated_data)

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "last_updated_date" not in validated_data:
            validated_data["last_updated_date"] = datetime.now()
        if 'vuln_type' in validated_data:
            validated_data["vuln_type"] = VulnType.objects.get(name=validated_data["vuln_type"])

        if "images" in validated_data:
            nested_serializer = self.fields['images']
            nested_instance = instance.images
            nested_data = validated_data.pop('images')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)
