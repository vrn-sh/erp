from datetime import datetime
from warnings import warn

from rest_framework import serializers
from io import BytesIO
import base64

from api.services.s3 import client
from api.models.vulns import Notes, VulnType, Vulnerability


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = '__all__'


class VulnTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VulnType
        fields = '__all__'


class VulnerabilitySerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), required=False)

    class Meta:
        model = Vulnerability
        fields = '__all__'

    def to_representation(self, instance):
        bucket_name = instance.bucket_name

        representation = super().to_representation(instance)
        s3_client = client()
        images = []

        to_serialize = representation.get('images')
        if not to_serialize:
            return representation

        for image in representation.get('images', []):
            data = s3_client.get_object(
                bucket_name=bucket_name,
                object_name=str(image)
            )
            data = BytesIO(data.read())
            image_data = base64.b64encode(data.getvalue()).decode()
            images.append(image_data)

        representation['images'] = images
        return representation


