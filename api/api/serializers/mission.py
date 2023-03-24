from rest_framework import serializers

from api.models.mission import Mission, Recon
from api.serializers import TeamSerializer


class ReconSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(many=False, read_only=True)

    class Meta:
        fields = '__all__'
        model = Mission

