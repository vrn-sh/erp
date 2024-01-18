"""
    This module stores all the views that are not part of a viewset
"""

from typing import List, Optional, Type
from django.contrib.auth import authenticate, login
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt

from rest_framework import permissions
from rest_framework.views import APIView
from knox.auth import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST
    )

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from api.models import Auth, Manager, Pentester, get_user_model

from knox.views import LoginView as KnoxLoginView

from api.serializers import LoginSerializer


class ResetPasswordView(APIView):

    """
    ResetPasswordView

        for all your password reset needs

        post:
            -> sets a new password (expects token value in path parameter & password in body)

        put:
            -> sets email to reset password for an account (expects email in body)
    """

    permissions_class: List[Type[TokenAuthentication]] = []
    authentication_classes: List[Type[AllowAny]] = []

    @swagger_auto_schema(
        operation_description="sets new password",
        manual_parameters=[
            openapi.Parameter(
                "token",
                "path",
                required=True,
                type=openapi.TYPE_STRING,
                description="account confirmation token",
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['password'],
            properties={
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        security=[],
        tags=['ResetPassword'],
    )
    def post(self, request):
        """
            Saves new password by matching the reset_password_token,
            then updating the password field.
        """
        token: Optional[str] = request.query_params.get('token', None)
        new_pass: Optional[str] = request.data.get('password', None)

        user: Optional[Auth] = None
        email: str = cache.get(token)
        if email:
            user = Auth.objects.filter(email=email).first()

        if not user or not token or not new_pass:
            return Response({
                    'error': 'could not find account',
            }, status=HTTP_404_NOT_FOUND)

        success_msg: str = 'password changed. please log in'
        user.set_password(new_pass)
        user.save()

        cache.delete(token)
        return Response({
                'message': success_msg,
        }, status=HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="sends email to reset account's password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        security=[],
        tags=['ResetPassword'],
    )
    def put(self, request):
        """
            Sends an email to reset the account's password
        """

        email: Optional[str]  = request.data.get('email')
        account: Optional[Auth] = Auth.objects.filter(email=email).first() if email is not None else None

        if email is None:
            return Response({
                'error': 'bad request',
            }, status=HTTP_400_BAD_REQUEST)

        if account is None:
            return Response({
                'error': 'no such account. please register',
            }, status=HTTP_404_NOT_FOUND)

        account.send_reset_password_email()
        return Response({
            'message': 'email has been sent',
        }, status=HTTP_200_OK)


class ConfirmAccountView(APIView):

    """
    ConfirmAccountView

        View used to confirm account upon creation

        put:
            -> Requests new confirmation email (Expects email field in body)

        post:
            -> Confirms account creation (expects token in path, password in body)
    """

    permission_classes = [AllowAny]
    authentication_classes: List[Type[TokenAuthentication]]= []

    @swagger_auto_schema(
        operation_description="requests account confirmation (or re-requests it)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        security=[],
        tags=['Confirm'],
    )
    def put(self, request):
        """
            Requests a (new) confirmation email. Expects an email field.
        """

        email = request.data.get('email')
        if email is None:
            return Response({
                'error': 'no email provided',
            }, status=HTTP_400_BAD_REQUEST)

        email = email.lower()
        user = Auth.objects.filter(email=email).first()
        if user is not None and not user.is_enabled:
            user.send_confirm_email()
            return Response({
                'message': 'success',
                'id': user.id
            }, status=HTTP_200_OK)
        return Response({
            'error': 'this email cannot request confirmation email',
        }, status=HTTP_403_FORBIDDEN)


    @swagger_auto_schema(
        operation_description="confirms account using a token and sets new password",
        manual_parameters=[
            openapi.Parameter(
                "token",
                "path",
                required=True,
                type=openapi.TYPE_STRING,
                description="account confirmation token",
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['password'],
            properties={
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
        security=[],
        tags=['Confirm'],
    )
    def post(self, request):
        """
            Activates an account if it is not already activated.
            Also provides log-in token to the user because it's annoying
            to connect after validating its email.
        """

        token = request.query_params.get('token')
        password = request.data.get("password")

        if token is None:
            return Response({
                'error': 'no token has been provided',
            }, status=HTTP_400_BAD_REQUEST)

        if password is None:
            return Response({
                'error': 'no password provided',
            }, status=HTTP_400_BAD_REQUEST)

        account: Optional[Auth] = None
        email: str = cache.get(token)

        if email:
            account = Auth.objects.filter(email=email).first()

        if account:
            account.is_enabled = True  # type: ignore
            account.set_password(password)
            account.save()

            cache.delete(token)
            return Response({
                'message': 'success! you may now connect to voron!',
            }, status=HTTP_200_OK)

        return Response({
            'error': 'no account has been found'
        }, status=HTTP_404_NOT_FOUND)



class LoginView(KnoxLoginView):
    """
        LoginView:
            Logs in any account

            post:
                -> Expects email & password in body, returns auth token
    """

    permission_classes = [AllowAny]
    authentication_classes: List[Type[TokenAuthentication]]= []

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
        """Logs in account, after checking if account has been disabled or not"""

        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'errors': serializer.errors,
            }, status=HTTP_400_BAD_REQUEST)

        auth = serializer.validated_data['user']  # type: ignore
        login(request, auth)

        knox_resp = super().post(request, format=None)
        user = get_user_model(auth)

        knox_resp.data['role'] = auth.role  # type: ignore
        knox_resp.data['id'] = user.id  # type: ignore
        return knox_resp


class PingView(APIView):
    """PingView: Simple test route to check if service is healthy"""

    @staticmethod
    def get(_) -> Response:
        """Returns Pong!"""
        content = {'message': 'pong !'}
        return Response(content, status=HTTP_200_OK)
