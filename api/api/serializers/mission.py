from json import loads
from rest_framework import serializers

from api.models.mission import Mission, Recon, NmapScan, CrtSh
from api.models.utils import NmapPort, parse_nmap_ips, parse_nmap_domain, parse_nmap_scan


class StringArrayField(serializers.ListField):
    """Serializing a list of fields"""

    def to_representation(self, data):
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
        read_only_fields = ['creation_timestamp', 'ips', 'ports', 'id']
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
    nmap = NmapSerializer(many=True, read_only=True)
    crtsh = CrtShSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Mission
