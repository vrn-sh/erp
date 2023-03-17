from rest_framework import serializers

from api.models.mission import Mission


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'start', 'end', 'duration', 'creation_date', 'last_updated_date', 'created_by', 'last_updated_by',
            'title'
        ]
        model = Mission