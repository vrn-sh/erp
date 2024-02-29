from django.db import models
from django.conf import settings


class ChatMessage(models.Model):
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages', null=True)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, null=True)
    receiver_id = models.CharField(max_length=255, null=True, blank=True)
    sender_info = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp}: {self.message}"
