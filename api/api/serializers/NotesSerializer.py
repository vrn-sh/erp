from datetime import datetime

from rest_framework import serializers

from api.models.NotesModel import Notes


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'content', 'creation_date', 'last_updated_date'
        ]
        model = Notes

    def create(self, validated_data):
        if "creation_date" not in validated_data:
            validated_data["creation_date"] = datetime.now()
            validated_data["last_updated_date"] = datetime.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "last_updated_date" not in validated_data:
            validated_data["last_updated_date"] = datetime.now()
        return super().update(instance, validated_data)
