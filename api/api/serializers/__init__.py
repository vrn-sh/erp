from rest_framework import serializers
from argon2 import PasswordHasher
from api.models import *

from api.serializers.utils import create_instance

"""This module stores all the basic serializers for user & authentication management"""


class TwoFactorAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwoFactorAuth
        fields = '__all__'


class AuthSerializer(serializers.ModelSerializer):
    two_factor = TwoFactorAuthSerializer(many=False, read_only=False)

    class Meta:
        model = Auth
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'last_login', 'two_factor', 'date_joined', 'password'
        ]

    def update(self, instance, validated_data):

        if 'two_factor' in validated_data:
            nested_serializer = self.fields['two_factor']
            nested_instance = instance.two_factor
            nested_data = validated_data.pop('two_factor')
            nested_serializer.update(nested_instance, nested_data)

        if 'password' in validated_data:
            passwd = validated_data['password']
            validated_data['password'] = PasswordHasher().hash(passwd)

        return super(AuthSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)
        return representation

    def create(self, validated_data):
        two_factor = create_instance(TwoFactorAuth, validated_data, 'two_factor')
        return Auth.objects.get_or_create(two_factor=two_factor, **validated_data)


class PentesterSerializer(serializers.ModelSerializer):
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
        return super(PentesterSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        auth_data = validated_data.pop('auth')
        auth_data['role'] = 1
        auth_data['is_superuser'] = False
        auth_data['is_staff'] = False
        two_factor = create_instance(TwoFactorAuth, auth_data, 'two_factor')
        auth = Auth.objects.create(two_factor=two_factor, **auth_data)
        return Pentester.objects.create(auth=auth, **validated_data)


class ManagerSerializer(serializers.ModelSerializer):
    auth = AuthSerializer(many=False, read_only=False)

    class Meta:
        model = Manager
        fields = '__all__'

    def create(self, validated_data):
        auth_data = validated_data.pop('auth')
        auth_data['role'] = 2
        auth_data['is_superuser'] = True
        auth_data['is_staff'] = True
        two_factor = create_instance(TwoFactorAuth, auth_data, 'two_factor')
        auth = Auth.objects.create(two_factor=two_factor, **auth_data)
        return Manager.objects.create(auth=auth, **validated_data)

    def update(self, instance, validated_data):
        if 'auth' in validated_data:
            nested_serializer = self.fields['auth']
            nested_instance = instance.auth
            nested_data = validated_data.pop('auth')
            nested_serializer.update(nested_instance, nested_data)
        return super(ManagerSerializer, self).update(instance, validated_data)
