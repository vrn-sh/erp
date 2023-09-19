from datetime import datetime
import os
from typing import List, Optional
from warnings import warn
from django.core.files.base import ContentFile

from rest_framework import serializers
from io import BytesIO
import uuid
import re
import base64
from api.models.mission import Mission
from api.serializers.utils import get_image_data, get_mime_type

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
    images = serializers.ListField(child=serializers.CharField(), required=False)

    class Meta:
        model = Vulnerability
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        s3_client = S3Bucket()

        images: List[str] = []
        for image in instance.images:

            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                continue

            s3_client = S3Bucket()
            images.append(s3_client.get_object_url('rootbucket', image))

        representation['images'] = images
        return representation

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        images = []

        for image_data in data.get('images', []):

            # silenlty passing erronous images
            # TODO(djnn): add error message (probably do the checks in viewset)
            mime_type = get_mime_type(image_data)
            image_data = get_image_data(image_data)

            if not mime_type or not image_data:
                continue

            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                continue

            s3_client = S3Bucket()
            image_name = f'{uuid.uuid4().hex}'

            iostream = BytesIO(image_data)
            _ = s3_client.upload_stream(
                'rootbucket',
                image_name,
                iostream,
                f'image/{mime_type}',
            )

            images.append(image_name)
        internal_value['images'] = images
        return internal_value
