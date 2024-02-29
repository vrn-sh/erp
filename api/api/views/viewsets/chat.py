from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from api.models.chat import ChatMessage
from api.serializers.chat import ChatMessageSerializer


class ChatMessageViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def send_message(self, request):
        if request.method == 'POST':
            sender = request.user
            receiver_id = request.data.get('receiver_id')
            message = request.data.get('message')
            receiver = get_object_or_404(User, id=receiver_id)
            chat_message = ChatMessage.objects.create(
                sender=sender, receiver=receiver, message=message)
            serializer = ChatMessageSerializer(chat_message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=True, methods=['get'])
    def get_messages(self, request, pk):
        sender = request.user
        receiver = get_object_or_404(User, id=pk)
        messages = ChatMessage.objects.filter(
            sender=sender, receiver=receiver) | ChatMessage.objects.filter(sender=receiver, receiver=sender)
        messages = messages.order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        pass

    def retrieve(self, request, *args, **kwargs):
        pass

    def update(self, request, *args, **kwargs):
        pass

    def partial_update(self, request, *args, **kwargs):
        pass

    def destroy(self, request, *args, **kwargs):
        pass
