from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt

from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
    )

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from api.backends import EmailBackend
from api.permissions import *


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @swagger_auto_schema(
        operation_description="Logs in account",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        security=[],
        tags=['Login'],
    )

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({
                'error': 'login request requires email and password fields',
            }, status=HTTP_400_BAD_REQUEST)

        email = email.lower()
        account = EmailBackend().get_user_by_email(email)
        if not account:
            return Response({
                'error': 'no such account',
            }, status=HTTP_404_NOT_FOUND)

        authenticated_account = authenticate(request, email=email, password=password)
        if not authenticated_account:
            return Response({
                'error': 'incorrect password',
            }, status=HTTP_403_FORBIDDEN)

        token, _created = Token.objects.get_or_create(user=account)
        return Response({
            'token': token,
            'id': account.id,
        }, status=HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Logs out account",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=[],
            properties={
            },
        ),
        security=[permissions.IsAuthenticated],
        tags=['Logout'],
    )

    @staticmethod
    def get(request):
        if hasattr(request.user, 'email'):
            request.user.auth_token.delete()
            return Response({
                'message': 'success',
            }, status=HTTP_200_OK)

        return Response({
            'error': 'no account matching your token',
        }, status=HTTP_404_NOT_FOUND)


class PingView(APIView):
    @staticmethod
    def get(request):
        content = {'message': 'pong !'}
        return Response(content, status=HTTP_200_OK)
