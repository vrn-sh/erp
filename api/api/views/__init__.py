"""
    This module stores all the views that are not part of a viewset
"""

from typing import List, Optional, Type
from django.contrib.auth import authenticate, login
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
from api.models import Auth


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
            openapi.Parameter(name="token",
                required=True,
                type="string",
                in_="path",
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
        user: Optional[Auth] = Auth.objects.filter(tmp_token=token).first() if token else None

        if not user or not token or not new_pass:
            return Response({
                    'error': 'could not find account',
                }, status=HTTP_404_NOT_FOUND)
        success_msg: str = 'password changed. please log in'
        user.set_password(new_pass)
        user.save()

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

        else:
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

        email = request.GET.get('email')
        if email is None:
            return Response({
                'error': 'no email provided',
            }, status=HTTP_400_BAD_REQUEST)

        email = email.lower()
        user = Auth.objects.filter(email=email).first()
        if user is not None:
            if user.is_disabled:
                user.tmp_token = None
                user.send_confirm_email()
                user.save()
                return Response({
                    'message': 'success',
                    'id': user.id
                }, status=HTTP_200_OK)
            return Response({
                'error': 'account is not locked and has already confirmed',
            }, status=HTTP_403_FORBIDDEN)
        return Response(status=HTTP_404_NOT_FOUND)


    @swagger_auto_schema(
        operation_description="confirms account using a token and sets new password",
        manual_parameters=[
            openapi.Parameter(name="token",
                required=True,
                type="string",
                in_="path",
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

        account = Auth.objects.filter(confirm_token=token).first()
        if account:
            account.tmp_token = None
            account.is_disabled = False
            account.set_password(password)
            account.save()

            authenticated_account = EmailBackend().get_user(account.id)
            token, _ = Token.objects.get_or_create(user=authenticated_account)
            login(request, authenticated_account)

            return Response({
                'token': token.key,
                'id': account.id,
            }, status=HTTP_200_OK)
        else:
            return Response({
                'error': 'no account has been found'
            }, status=HTTP_404_NOT_FOUND)



class LoginView(APIView):
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
    def post(self, request):
        """Logs in account, after checking if account has been disabled or not"""
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({
                'error': 'login request requires email and password fields',
            }, status=HTTP_400_BAD_REQUEST)

        email = email.lower()
        account = Auth.objects.filter(email=email).first()
        if not account:
            return Response({
                'error': 'no such account',
            }, status=HTTP_404_NOT_FOUND)

        if account.is_disabled:
            return Response({
                'error': 'please confirm account first',
            }, status=HTTP_403_FORBIDDEN)

        authenticated_account = authenticate(request, username=email, password=password)
        if not authenticated_account:
            return Response({
                'error': 'incorrect password',
            }, status=HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=account)
        return Response({
            'token': str(token),
            'id': account.id,
        }, status=HTTP_201_CREATED)


class LogoutView(APIView):
    """LogoutView: Logs out account"""

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
        security=['Bearer'],
        tags=['Logout'],
    )

    @staticmethod
    def get(request) -> Response:
        """Just destroys token if it finds one. As simple as it gets."""
        if hasattr(request.user, 'email'):
            request.user.auth_token.delete()
            return Response({
                'message': 'success',
            }, status=HTTP_200_OK)

        return Response({
            'error': 'no account matching your token',
        }, status=HTTP_404_NOT_FOUND)


class PingView(APIView):
    """PingView: Simple test route to check if service is healthy"""

    @staticmethod
    def get(_) -> Response:
        """Returns Pong!"""
        content = {'message': 'pong !'}
        return Response(content, status=HTTP_200_OK)
