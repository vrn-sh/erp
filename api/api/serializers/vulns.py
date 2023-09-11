import os
from typing import List

from rest_framework import serializers

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

        representation['images'] = []

        if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
            return representation

        if not instance.images:
            return representation

        images: List[str] = []
        for image in instance.images:

            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                continue

            s3_client = S3Bucket()
            images.append(s3_client.get_object_url('rootbucket', image))

        representation['images'] = images
        return representation
