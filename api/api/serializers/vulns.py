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

    def get_image_data(self, content: str) -> Optional[bytes]:
        """Strips the MIME type information from image data"""
        as_base64 = content.split('base64,')
        if len(as_base64) != 2:
            return None

        as_base64 = as_base64[1]
        from_base64 = base64.b64decode(as_base64)
        return from_base64

    def get_mime_type(self, content: str) -> Optional[str]:
        """Get MIME type from the start of an image file"""

        pattern = re.compile('data:(.*);base64')
        if pattern.match(content):
            rg_search = pattern.search(content)
            if not rg_search:
                return None

            content_type = rg_search.group(0)
            if not content_type.startswith('data:image/'):
                return None

            image_type = content_type.split('/')[1].split(';', 1)[0]
            allowed_filetype = ['jpg', 'jpeg', 'png', 'gif']

            if image_type not in allowed_filetype:
                return None
            return image_type
        return None

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
            mime_type = self.get_mime_type(image_data)
            image_data = self.get_image_data(image_data)
            if not mime_type or not image_data:
                continue

            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                continue

            s3_client = S3Bucket()
            image_name =  f'{uuid.uuid4().hex}.{mime_type}'
            iostream = BytesIO(image_data)
            s3_client.upload_stream(
                'rootbucket',
                image_name,
                iostream,
                f'image/{mime_type}',
            )

            images.append(image_name)
        internal_value['images'] = images
        return internal_value