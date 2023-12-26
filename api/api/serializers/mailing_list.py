from rest_framework import serializers
from api.models.mailing_list import MailingListItem


class MailingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailingListItem
        fields = ['email']