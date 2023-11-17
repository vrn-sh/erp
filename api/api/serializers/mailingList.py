from rest_framework import serializers
from api.models.mailingList import MailingListItem


class MailingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailingListItem
        fields = ['email']

    def validate_email(self, value):
        """
        Check that the email is valid.
        """
        if not value or "@" not in value:
            raise serializers.ValidationError(
                "Please enter a valid email address.")
        return value
