from rest_framework import serializers

from api.models.mission import Mission, Recon, NmapScan
from api.models.utils import parse_nmap_ips, parse_nmap_domain, parse_nmap_scan


class NmapSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['creation_timestamp', 'ips', 'ports']
        model = NmapScan
        ordering = ['-creation_timestamp']

    def create(self, validated_data):
        nmap_scan = NmapScan.objects.get(recon=validated_data['recon'])
        parse_functions = [parse_nmap_ips, parse_nmap_domain, parse_nmap_scan]

        for func in parse_functions:
            result = func(validated_data['nmap_file'])
            if not result:
                nmap_scan.delete()
                raise serializers.ValidationError(f"Error parsing {func.__name__}")
            setattr(nmap_scan, func.__name__, result)

        nmap_scan.save()
        return nmap_scan

    def update(self, instance, validated_data):
        instance.nmap_file = validated_data.get('nmap_file', instance.nmap_file)
        parse_functions = [parse_nmap_ips, parse_nmap_domain, parse_nmap_scan]

        for func in parse_functions:
            result = func(validated_data['nmap_file'])
            if not result:
                raise serializers.ValidationError(f"Error parsing {func.__name__}")
            setattr(instance, func.__name__, result)

        instance.save()
        return instance


class ReconSerializer(serializers.ModelSerializer):
    nmap = NmapSerializer(many=True, read_only=True)

    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Mission

