from warnings import warn
from rest_framework import serializers

from api.models.mission import Mission, Recon, NmapScan
from api.models.utils import NmapPort, NmapPortField, parse_nmap_ips, parse_nmap_domain, parse_nmap_scan
from api.serializers import TeamSerializer


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
        read_only_fields = ['creation_timestamp', 'ips', 'ports', 'id']
        model = NmapScan
        ordering = ['-creation_timestamp']


class ReconSerializer(serializers.ModelSerializer):
    nmap = NmapSerializer(many=True, read_only=True)

    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(many=False, read_only=True)
    team = TeamSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Mission

