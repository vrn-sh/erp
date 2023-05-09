from datetime import datetime
from warnings import warn
from django.core.files.base import ContentFile

from rest_framework import serializers
from io import BytesIO
import base64

from api.services.s3 import S3Bucket
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
        representation = super().to_representation(instance)
        s3_client = S3Bucket()
        for index, image in enumerate(instance.images):
            image_data = s3_client.get_object(instance.bucket_name, str(image))
            image_content = image_data.read()
            representation['images'][index] = image_content.encode('base64').decode()
        return representation

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        s3_client = S3Bucket()
        images = []
        for image_data in data.get('images', []):
            decoded_image = image_data.decode('base64')
            content_file = ContentFile(decoded_image)
            s3_client.upload_file(internal_value.bucket_name, content_file.name, content_file)
            images.append(image_name)
        internal_value['images'] = images
        return internal_value
