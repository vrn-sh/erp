from rest_framework import serializers
from api.models import Team

from api.models.mission import Mission, Recon


class ReconSerializer(serializers.Serializer):
    class Meta:
        fields = '__all__'
        model = Recon


class MissionSerializer(serializers.HyperlinkedModelSerializer):
    recon = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    team = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        fields = [
            'recon', 'team', 'start', 'end', 'last_updated',
            'last_updated_by', 'title', 'id'
        ]
        model = Mission
