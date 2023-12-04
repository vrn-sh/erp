from rest_framework import serializers
from api.models.mailingList import MailingListItem


class MailingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailingListItem
        fields = ['email']