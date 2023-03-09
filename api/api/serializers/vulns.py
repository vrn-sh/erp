from rest_framework import serializers

from api.models.vulns import Notes, VulnType, ImageModel, Vulnerability
from api.serializers import create_instance, AuthSerializer


class NotesSerializer(serializers.ModelSerializer):
    author = AuthSerializer(many=False, read_only=True)
    """
        Should looks like:
        {
            "content": "blabla",
            "author": {
                "id": [id of the author],
                "first_name": ...,
                "last_name": ...,
                "username": ...
            }
        }
    """

    class Meta:
        fields = [
            'id', 'content', 'creation_date', 'last_updated_date', 'author'
        ]
        model = Notes


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
    images = ImageSerializer(many=True, read_only=False)

    class Meta:
        fields = [
            'id', 'title', 'description', 'images', 'pentester', 'last_editor', 'vuln_type'
        ]

        model = Vulnerability

    def create(self, validated_data):
        '''
            We are not using "nested serializer" for vuln_type because there is no use.
            In fact, a new vuln type won't happen often so here it's read only
        '''
        validated_data["vuln_type"] = VulnType.objects.filter(name=validated_data["vuln_type"]).id
        if "images" in validated_data:
            images = create_instance(ImageSerializer, validated_data, "images")
            return Vulnerability.objects.create(images=images, **validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data["vuln_type"] = VulnType.objects.filter(name=validated_data["vuln_type"]).id
        if "images" in validated_data:
            nested_serializer = self.fields['images']
            nested_instance = instance.images
            nested_data = validated_data.pop('images')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)
