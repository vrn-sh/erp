# Search across all models

import numpy as np
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from api.models import (
    Pentester,
    Team,
    Manager,
    Pentester
)
from api.models.mission import Mission
from api.models.vulns import Vulnerability


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'look_for_team',
                openapi.IN_QUERY,
                description='Whether to include teams in the search results',
                type=openapi.TYPE_BOOLEAN
            ),
            openapi.Parameter(
                'search_managers',
                openapi.IN_QUERY,
                description='Whether to include managers in the search results',
                type=openapi.TYPE_BOOLEAN
            ),
            openapi.Parameter(
                'size',
                openapi.IN_QUERY,
                description='The maximum number of search results to return',
                type=openapi.TYPE_INTEGER
            )
        ]
    )

    def get(self, request):
        query = request.query_params.get('q', None)
        if not query:
            return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        look_for_team = request.query_params.get('look_for_team', False)
        search_managers = request.query_params.get('search_managers', False)
        size = request.query_params.get('size', 20)

        managers = self.fetch(Manager, query, request.user, search_managers=search_managers)
        pentesters = self.fetch(Pentester, query, request.user)
        teams = Team.objects.none()
        vulnerabilities = self.fetch(Vulnerability, query, request.user)
        missions = self.fetch(Mission, query, request.user)

        results = []

        for model in [missions, vulnerabilities, managers, pentesters, teams]:
            for item in model:
                attributes = {}
                if hasattr(item, 'title'):
                    attributes['title'] = item.title
                if hasattr(item, 'auth'):
                    attributes['username'] = item.auth.username
                results.append({
                    'id': item.id,
                    **attributes,
                    'model': model.model.__name__
                })

        if results == []:
            return Response({'error': 'No results found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'results': results
        })

    def fetch(self, model, query, user, search_managers=False):
        if not query:
            return None

        filters = Q()

        if hasattr(model, 'title') and model in [Mission, Vulnerability]:
            filters = Q(title__icontains=query)
        if model == Manager or model == Pentester:
            filters = Q(auth__username__icontains=query)
        if model == Team:
            filters = Q(teams__name__icontains=query)

        return model.objects.filter(filters)
