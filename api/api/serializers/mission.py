from json import loads
from django.core.cache import cache
from rest_framework import serializers
from api.services.s3 import S3Bucket
from weasyprint.text.fonts import warn

from api.models.mission import Mission, Recon, NmapScan, CrtSh
from api.models.utils import NmapPort
from api.models.mission import Credentials, Mission, Recon, NmapScan, CrtSh
from api.models.utils import NmapPort

from api.services.s3 import S3Bucket

import os

class StringArrayField(serializers.ListField):
    """Serializing a list of fields"""

    def to_representation(self, data):  # type: ignore
        data = super().to_representation(data)
        return ",".join([str(element) for element in data])

    def to_internal_value(self, data):
        data = data.split(",")
        return super().to_internal_value(data)


class NmapPortSerializer(serializers.Field):
    def to_representation(self, value):
        return f"{value.port_number}/{value.protocol} {value.state} {value.metadata}"

    def to_internal_value(self, data):
        if isinstance(data, dict):
            return NmapPort(**data)
        if isinstance(data, NmapPort):
            return data
        self.fail('invalid', input=data)
        return {}


class NmapSerializer(serializers.ModelSerializer):
    ips = serializers.ListField(child=serializers.CharField())
    ports = serializers.ListField(child=NmapPortSerializer())

    class Meta:
        fields = '__all__'
        model = NmapScan
        ordering = ['-creation_timestamp']


class CrtShSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['dump']
        model = CrtSh

    def to_representation(self, instance):
        data = {}
        data['certificates'] = loads(instance.dump)
        return data


class ReconSerializer(serializers.ModelSerializer):
    nmap_runs = NmapSerializer(read_only=True, many=True)
    crtsh_runs = CrtShSerializer(read_only=True, many=True)

    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(read_only=True)
    status = serializers.ReadOnlyField()

    class Meta:
        fields = '__all__'
        model = Mission

    def to_representation(self, instance):

        if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
            representation = super().to_representation(instance)
            representation['images'] = []
            return representation

        if cached := cache.get(f'mission_{instance.pk}'):
            return cached

        repr = super().to_representation(instance)
        if instance.logo is not None:
            if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                return repr

            s3_client = S3Bucket()
            repr['logo'] = s3_client.get_object_url('rootbucket', instance.logo)
        repr['status'] = instance.status
        cache.set(f'mission_{instance.pk}', repr)
        return repr


class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'login', 'password', 'service', 'comment', 'mission']
        model = Credentials
