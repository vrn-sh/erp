from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import (
        HTTP_400_BAD_REQUEST,
        HTTP_200_OK,
        HTTP_403_FORBIDDEN,
        HTTP_404_NOT_FOUND,
        HTTP_406_NOT_ACCEPTABLE
        )

from api.serializers import *

from api.permissions import IsManager, IsOwner, IsPentester, PostOnly

"""This module stores the generic viewsets used when basic CRUD is required

- TwoFactorViewset: 2FA class CRUD
- AuthViewset: Auth class CRUD
- RegisterViewset: Pentester creation route
- PentesterViewset: Pentester CRUD
- ManagerViewset: Manager CRUD
"""


class TwoFactorViewset(viewsets.ModelViewSet):
    queryset = TwoFactorAuth.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager | IsOwner]
    authentication_classes = [TokenAuthentication]
    serializer_class = TwoFactorAuthSerializer


class RegisterViewset(viewsets.ModelViewSet):
    queryset = Pentester.objects.all()
    permission_classes = [PostOnly]
    authentication_classes = []
    serializer_class = PentesterSerializer


class PentesterViewset(viewsets.ModelViewSet):
    queryset = Pentester.objects.all()
    permission_classes = []
    authentication_classes = []
    serializer_class = PentesterSerializer


class ManagerViewset(viewsets.ModelViewSet):
    queryset = Manager.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager]
    authentication_classes = [TokenAuthentication]
    serializer_class = ManagerSerializer


class AuthViewset(viewsets.ModelViewSet):
    queryset = Auth.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsManager | IsOwner]
    authentication_classes = [TokenAuthentication]
    serializer_class = AuthSerializer
