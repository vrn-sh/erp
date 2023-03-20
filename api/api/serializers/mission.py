from rest_framework import serializers
from api.models import Team

from api.models.mission import Mission, Recon
from api.serializers import TeamSerializer


class ReconSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.ModelSerializer):
    recon = ReconSerializer(many=False, read_only=True)
    team = TeamSerializer(many=True, read_only=False)

    class Meta:
        fields = [
            'recon', 'team', 'start', 'end', 'last_updated',
            'last_updated_by', 'title', 'id', 'days_left'
        ]
        model = Mission
