from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.services.hunter import Hunter

class HunterView(APIView):
    """View for hunter.io integration"""

    def get(self, request):
        domain = request.query_params.get('domain', None)
        email = request.query_params.get('email', None)
        first_name = request.query_params.get('first_name', None)
        last_name = request.query_params.get('last_name', None)

        if domain:
            hunter = Hunter()
            domain_info = hunter.get_domain(domain)
            return Response(domain_info, status=status.HTTP_200_OK)

        if email:
            hunter = Hunter()
            email_info = hunter.verify_email(email)
            return Response(email_info, status=status.HTTP_200_OK)

        if first_name and last_name:
            domain = request.query_params.get('domain', None)
            hunter = Hunter()
            email_info = hunter.get_email_finder(first_name, last_name, domain)
            return Response(email_info, status=status.HTTP_200_OK)

        return Response({'message': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
