from datetime import datetime

from rest_framework import serializers

from api.models.vulns import Notes, VulnType


class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'content', 'creation_date', 'last_updated_date', 'author'
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

class VulnTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'name', 'description'
        ]
        model = VulnType


class VulnerabilitySerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            'id', 'title', 'description', 'images', 'author', 'last_editor', 'vuln_type'
        ]

    def create(self, validated_data):
        if "creation_date" not in validated_data:
            validated_data["creation_date"] = datetime.now()
            validated_data["last_updated_date"] = datetime.now()
        if "last_editor" not in validated_data:
            validated_data["last_editor"] = validated_data["author"]
        validated_data["vuln_type"] = VulnType.objects.filter(name=validated_data["vuln_type"]).id
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "last_updated_date" not in validated_data:
            validated_data["last_updated_date"] = datetime.now()
        validated_data["vuln_type"] = VulnType.objects.filter(name=validated_data["vuln_type"]).id
        return super().update(instance, validated_data)
