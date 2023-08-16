from rest_framework import serializers
from ..models.mission import Mission
from ..models.client_infos import ClientInfo


class ClientInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInfo
        fields = '__all__'


class MissionSerializer(serializers.ModelSerializer):
    details = ClientInfoSerializer()

    class Meta:
        model = Mission
        fields = '__all__'
