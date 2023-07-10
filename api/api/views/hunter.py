from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.hunter import Hunter

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


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
