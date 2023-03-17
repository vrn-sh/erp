"""This module stores all the basic serializers for user & authentication management"""

from rest_framework import serializers
from argon2 import PasswordHasher
from rest_framework.exceptions import ValidationError

from api.models import Admin, Pentester, Auth
from api.serializers.utils import create_instance

class AuthSerializer(serializers.ModelSerializer):
    """Serializer for Base Auth model (should only be used nested in other serializers)"""
    class Meta:
        model = Auth
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'last_login', 'date_joined', 'password', 'phone_number'
        ]

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password'] = PasswordHasher().hash(password)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)
        return representation

    def create(self, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            validated_data['password'] = PasswordHasher().hash(password)
        return Auth.objects.create(**validated_data)


class PentesterSerializer(serializers.ModelSerializer):
    """serializer used for Pentester CRUD operations"""
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Pentester
        fields = '__all__'

    def update(self, instance, validated_data):
        if 'auth' in validated_data:
            nested_serializer = self.fields['auth']
            nested_instance = instance.auth
            nested_data = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)

    def create(self, validated_data):
        validated_data['auth']['role'] = 1
        validated_data['auth']['is_superuser'] = False
        validated_data['auth']['is_staff'] = False
        auth = create_instance(AuthSerializer, validated_data, 'auth')
        return Pentester.objects.create(auth=auth, **validated_data)


class AdminSerializer(serializers.ModelSerializer):
    """serializer used for Admin CRUD operations"""
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Admin
        fields = '__all__'

    def create(self, validated_data):
        validated_data['auth']['role'] = 2
        validated_data['auth']['is_superuser'] = True
        validated_data['auth']['is_staff'] = True
        auth = create_instance(AuthSerializer, validated_data, 'auth')
        return Admin.objects.create(auth=auth, **validated_data)

    def update(self, instance, validated_data):
        if 'auth' in validated_data:
            nested_serializer = self.fields['auth']
            nested_instance = instance.auth
            nested_data = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)
