from rest_framework.compat import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.hunter import Hunter

import os

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class SaasProxyView(APIView):
    """
        view that calls saas using API key

        TODO(clara): to be used once saas uploads binaries to S3
    """

    def post(self, request, *args, **kwargs):

        params = request.query_params

        api_key = os.environ.get('SAAS_API_KEY')
        api_url = os.environ.get('SAAS_API_URL')

        if not api_key or not api_url:
            return Response({
                'error': 'please set SAAS env values in your back-end',
            }, status=status.HTTP_400_BAD_REQUEST)

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Api-Key': api_key,
        }

        result = requests.post(api_url, headers=headers, params=params)
        return Response(result.json(), status=status.HTTP_200_OK)



class WappProxyView(APIView):
    """View that calls proxy to our fingerprinting service"""

    def get(self, request, *args, **kwargs):

        if target_url := request.query_params.get('target_url', None):

            api_key = os.environ.get('WAPP_API_KEY')
            api_url = os.environ.get('WAPP_API_URL')

            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Api-Key': api_key,
            }

            result = requests.get(f'{api_url}?target_url={target_url}', headers=headers)
            return Response({
                'data': result.json(),
            }, status=status.HTTP_200_OK)


        return Response({
            'error': 'please specify target url',
        }, status=status.HTTP_400_BAD_REQUEST)


class HunterView(APIView):
    """Verify emails and get domain info"""

    @swagger_auto_schema(
        operation_description='Get domain info',
        manual_parameters=[
            openapi.Parameter(
                'domain',
                openapi.IN_QUERY,
                required=True,
                description='Domain name',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'email',
                openapi.IN_QUERY,
                description='Email address',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'first_name',
                openapi.IN_QUERY,
                description='First name',
                type=openapi.TYPE_STRING,
            ),
            openapi.Parameter(
                'last_name',
                openapi.IN_QUERY,
                description='Last name',
                type=openapi.TYPE_STRING,
            ),
        ],
        responses={
            200: openapi.Response(
                description='Domain info',
                examples={
                    'application/json': {
                        'data': {
                            'domain': 'example.com',
                            'disposable': False,
                            'webmail': False,
                            'pattern': '{first}',
                            'organization': 'Example Inc.',
                            'emails': [
                                {
                                    'value':
                                        {
                                            'first_name': 'John',
                                            'last_name': 'Doe',
                                            'position': 'CEO',
                                        },
                                },
                            ],
                            'sources': [
                                'example.com',
                                'example.org',
                            ],
                            'smtp_server': 'mx.example.com',
                            'smtp_check': True,
                            'created_at': '2021-02-18T08:45:00.000Z',
                        },
                    },
                },
            ),
            400: openapi.Response(
                description='Bad request',
                examples={
                    'message': 'Invalid request',
                },
            ),
            401: openapi.Response(
                description='Unauthorized',
                examples={
                    'application/json': {
                        'errors': [
                            'Unauthorized',
                        ],
                    },
                },
            )
        },
    )
    def get(self, request):
        domain = request.query_params.get('domain', None)
        email = request.query_params.get('email', None)
        first_name = request.query_params.get('first_name', None)
        last_name = request.query_params.get('last_name', None)

        if first_name and last_name and domain:
            domain = request.query_params.get('domain', None)
            hunter = Hunter()
            email_info = hunter.get_email_finder(first_name, last_name, domain)
            return Response(email_info, status=status.HTTP_200_OK)

        elif domain:
            hunter = Hunter()
            domain_info = hunter.get_domain(domain)
            return Response(domain_info, status=status.HTTP_200_OK)

        elif email:
            hunter = Hunter()
            email_info = hunter.verify_email(email)
            return Response(email_info, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
