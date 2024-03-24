from rest_framework import viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from pusher import Pusher
from api.models.send_message import ChatMessage
from api.models import Team
from api.serializers.send_message import ChatMessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

PUSHER_APP_ID = "1759644"
PUSHER_KEY = "8704037a23dad6569f48"
PUSHER_SECRET = "e3f03562b2286605f92f"
PUSHER_CLUSTER = "eu"

pusher = Pusher(
    app_id=PUSHER_APP_ID,
    key=PUSHER_KEY,
    secret=PUSHER_SECRET,
    cluster=PUSHER_CLUSTER,
)


class SendMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def create(self, request, *args, **kwargs):
        message = request.data.get('message')
        team_id = request.data.get('team_id')
        # Use sender_info directly from the request
        sender_info = request.data.get('senderId')

        if not message or not team_id:
            return JsonResponse({'status': 'error', 'message': 'Message and Team ID are required'}, status=400)

        try:
            team = Team.objects.get(pk=team_id)
            sender = None  # Initialize sender as None

            # Attempt to resolve the sender from the sender_info if possible
            if sender_info:
                try:
                    User = get_user_model()
                    sender = User.objects.get(username=sender_info)
                except User.DoesNotExist:
                    pass  # If user does not exist, continue without setting the sender

            # Create the ChatMessage with optional sender
            chat_message = ChatMessage.objects.create(
                message=message, team=team, sender=sender, sender_info=sender_info if sender is None else sender.username)

            serializer = self.get_serializer(chat_message)

            pusher.trigger('chat-channel', 'chat-event', {
                'message': message,
                'team_id': team_id,
                'sender_name': sender_info  # Use sender_info directly
            })

            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)

        except Team.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def search_messages_by_team(self, request):
        # Retrieve team_id from query parameters
        team_id = request.query_params.get('team_id')
        if team_id:
            try:
                # Filter messages by team
                messages = ChatMessage.objects.filter(team_id=team_id)
                serializer = ChatMessageSerializer(messages, many=True)
                return Response(serializer.data)
            except Team.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Team not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Return an error if no team_id is provided
            return JsonResponse({'status': 'error', 'message': 'Team ID is required to fetch messages'}, status=status.HTTP_400_BAD_REQUEST)

    def all_messages(self, request):
        if request.method == 'GET':
            messages = ChatMessage.objects.all()
            serializer = ChatMessageSerializer(messages, many=True)
            return Response(serializer.data)
