"""This module stores all the basic serializers for user & authentication management"""

from io import BytesIO
import os
from typing import Any, Optional, OrderedDict
import uuid
from warnings import warn
from rest_framework import serializers
from argon2 import PasswordHasher
from api.backends import EmailBackend

from api.models import Freelancer, Manager, Pentester, Auth, Team
from api.serializers.utils import create_instance, get_image_data, get_mime_type
from api.services.s3 import S3Bucket


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        email: Optional[str] = attrs.get("email")
        password: Optional[str] = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("login request requires email and password fields")

        email = email.lower()
        account = Auth.objects.filter(email=email).first()
        if not account:
            raise serializers.ValidationError("no such account")

        if not account.is_enabled:
            raise serializers.ValidationError("please confirm account first")

        authenticated_account = EmailBackend().authenticate(None, username=email, password=password)
        if not authenticated_account:
            raise serializers.ValidationError("incorrect password")

        return {'user': authenticated_account}


class AuthSerializer(serializers.ModelSerializer):
    """Serializer for Base Auth model (should only be used nested in other serializers)"""
    class Meta:
        model = Auth
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'last_login', 'date_joined', 'password',
            'phone_number', 'role', 'favorites',
            'profile_image', 'has_otp'
        ]

    def update(self, instance, validated_data) -> Auth:
        if 'password' in validated_data:
            password: str = validated_data.pop('password')
            validated_data['password'] = PasswordHasher().hash(password)

        return super().update(instance, validated_data)


    def create(self, validated_data) -> Auth:
        if 'password' in validated_data:
            password: str = validated_data.pop('password')
            validated_data['password'] = PasswordHasher().hash(password)

        # temporarily set here until sendgrid is fixed
        # validated_data['is_enabled'] = True
        return Auth.objects.create(**validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)

        if instance.profile_image is not None:
            if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                return representation

            s3_client = S3Bucket()
            representation['profile_image'] = s3_client.get_object_url('rootbucket', instance.profile_image)  # type: ignore

        return representation


class PentesterSerializer(serializers.ModelSerializer):
    """serializer used for Pentester CRUD operations"""
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Pentester
        fields = '__all__'

    def update(self, instance, validated_data) -> Pentester:
        if 'auth' in validated_data:
            nested_serializer: AuthSerializer = self.fields['auth']  # type: ignore
            nested_instance: Auth = instance.auth
            nested_data: dict[str, str] = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)

    def create(self, validated_data) -> Pentester:
        validated_data['auth']['role'] = 1
        validated_data['auth']['is_superuser'] = False
        validated_data['auth']['is_staff'] = False
        auth = create_instance(AuthSerializer, validated_data, 'auth')  # type: ignore
        return Pentester.objects.create(auth=auth, **validated_data)  # type: ignore


class ManagerSerializer(serializers.ModelSerializer):
    """serializer used for Admin CRUD operations"""
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Manager
        fields = '__all__'

    def create(self, validated_data) -> Manager:
        validated_data['auth']['role'] = 2
        validated_data['auth']['is_superuser'] = False
        validated_data['auth']['is_staff'] = False
        auth: Auth = create_instance(AuthSerializer, validated_data, 'auth')  # type: ignore
        return Manager.objects.create(auth=auth, **validated_data)  # type: ignore

    def update(self, instance, validated_data) -> Manager:
        if 'auth' in validated_data:
            nested_serializer: AuthSerializer = self.fields['auth']  # type: ignore
            nested_instance: Auth = instance.auth
            nested_data: dict[str, str] = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)


class FreelancerSerializer(serializers.ModelSerializer):
    """serializer used for Admin CRUD operations"""
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Freelancer
        fields = '__all__'

    def create(self, validated_data) -> Freelancer:
        validated_data['auth']['role'] = 3
        validated_data['auth']['is_superuser'] = False
        validated_data['auth']['is_staff'] = False
        auth: Auth = create_instance(AuthSerializer, validated_data, 'auth')  # type: ignore
        return Freelancer.objects.create(auth=auth, **validated_data)  # type: ignore

    def update(self, instance, validated_data) -> Freelancer:
        if 'auth' in validated_data:
            nested_serializer: AuthSerializer = self.fields['auth']  # type: ignore
            nested_instance: Auth = instance.auth
            nested_data: dict[str, str] = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super().update(instance, validated_data)


class TeamSerializer(serializers.ModelSerializer):
    """nested serializer for a Team (which allows Pentester creation)"""

    class Meta:
        model = Team
        fields = ['id', 'leader', 'members', 'name']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['members'] = PentesterSerializer(instance.members, many=True).data
        ret['leader'] = ManagerSerializer(instance.leader).data
        return ret

