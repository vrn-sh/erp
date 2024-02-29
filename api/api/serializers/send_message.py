# api/serializers.py

from rest_framework import serializers
from api.models.send_message import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'timestamp', 'sender',
                  'team', 'sender_info']
