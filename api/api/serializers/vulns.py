from datetime import datetime
from typing import List, Optional
from warnings import warn
from django.core.files.base import ContentFile

from rest_framework import serializers
from io import BytesIO
import uuid
import re
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
            images.append(s3_client.get_object_url(instance.bucket_name, image))

        representation['images'] = images
        return representation

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        s3_client = S3Bucket()
        images = []

        for image_data in data.get('images', []):

            # silenlty passing erronous images
            # TODO(djnn): add error message (probably do the checks in viewset)
            mime_type = self.get_mime_type(image_data)
            if not mime_type:
                continue

            image_name =  f'{uuid.uuid4().hex}.{mime_type}'
            iostream = BytesIO(image_data.decode('base64').encode('utf-8'))
            s3_client.upload_stream(
                internal_value.bucket_name,
                image_name,
                iostream,
                f'image/{mime_type}',
            )

            images.append(image_name)
        internal_value['images'] = images
        return internal_value
