""" Multi-factor Anthentication views """

import pyotp

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.permissions import IsAuthenticated


class MFAView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Generate a new MFA code for the user",
        responses={
            200: openapi.Response(
                description="MFA code generated successfully",
                examples={
                    "application/json": {
                        "success": True,
                        "mfa_code": "123456"
                    }
                }
            ),
            400: openapi.Response(
                description="MFA is already enabled for this user",
                examples={
                    "application/json": {
                        "error": "MFA is already enabled for this user"
                    }
                }
            )
        }
    )
    def get(self, request):
        user = request.user
        if user.has_otp:
            return Response({'error': 'MFA is already enabled for this user'}, status=status.HTTP_400_BAD_REQUEST)
        user.mfa_secret = pyotp.random_base32()
        totp = pyotp.TOTP(user.mfa_secret, interval=60)

        user.save()

        if '1' in (os.environ.get('TEST', '0'), os.environ.get('CI', '0')):
            info(f'Passing send_mfa_mail() to {self.email}')
            return 1

        warning(f'Sending mfa_code email to {self.email}')

        template_id = os.environ.get('SENDGRID_MFA_TEMPLATE_ID')

        if not template_id:
            warning('No template detected...proceeding with default email.')
            return send_mail(
                f'{self.first_name}, this is your MFA code',
                f'Hello there\nThis is your MFA code: {totp.now()}',
                os.environ['SENDGRID_SENDER'],
                [self.email],
            )

        mail = SendgridClient([self.email])
        mail.set_template_data({
            'username': self.first_name,
            'email': self.email,
            'mfa_code': totp.now(),
        })
        mail.set_template_id(template_id)
        mail.send()
        return Response({'success': "MFA code generated and email sent successfully", 'mfa_code': totp.now()})


    @swagger_auto_schema(
        operation_description="Enable MFA for the user",
        responses={
            200: openapi.Response(
                description="MFA enabled successfully",
                examples={
                    "application/json": {
                        "success": "MFA is enabled for this user"
                    }
                }
            ),
            400: openapi.Response(
                description="MFA code is required",
                examples={
                    "application/json": {
                        "error": "MFA code is required"
                    }
                }
            ),
            400: openapi.Response(
                description="Invalid MFA code",
                examples={
                    "application/json": {
                        "error": "Invalid MFA code"
                    }
                }
            )
        }
    )
    def post(self, request):
        user = request.user
        mfa_code = request.query_params.get('mfa_code', None)
        if not mfa_code:
            return Response({'error': 'MFA code is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not pyotp.TOTP(user.mfa_secret).verify(mfa_code):
            return Response({'error': 'Invalid MFA code'}, status=status.HTTP_400_BAD_REQUEST)
        user.has_otp = True
        user.save()
        return Response({'success': "MFA is enabled for this user"})
