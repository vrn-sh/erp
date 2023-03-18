from rest_framework import serializers

from api.models.mission import Mission


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Mission