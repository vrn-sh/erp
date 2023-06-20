# Search across all models

import numpy as np
from rest_framework import viewsets
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


class SearchView(viewsets.ViewSet):
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


    def fetch(self, model, query, user, search_managers=False):
        if not query:
            return None

        filters = Q(name__icontains=query) | \
                Q(description__icontains=query) | \
                Q(impact__icontains=query) | \
                Q(recommendation__icontains=query)

        if user.is_superuser or (search_managers and model == Manager):
            return model.objects.filter(filters)
        elif hasattr(model, 'team'):
            return model.objects.filter(filters, team__in=user.teams.all())
        else:
            return model.objects.none()


    def get(self, request):
        query = request.query_params.get('q', None)
        if query is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        look_for_team = request.query_params.get('look_for_team', False)
        search_managers = request.query_params.get('search_managers', False)
        size = request.query_params.get('size', 20)

        managers = self.fetch(Manager, query, request.user, search_managers=search_managers)
        pentesters = self.fetch(Pentester, query, request.user)
        teams = Team.objects.none()
        if look_for_team:
            user_teams = request.user.teams.all()
            teams = self.fetch(Team, query, request.user).exclude(id__in=[team.id for team in user_teams])
        vulnerabilities = self.fetch(Vulnerability, query, request.user)
        missions = self.fetch(Mission, query, request.user)

        results = []
        for model in [managers, pentesters, teams, vulnerabilities, missions]:
            for item in model:
                name = item.name if hasattr(item, 'name') else item.first_name + ' ' + item.last_name
                similarity = np.dot(query, name) / (np.linalg.norm(query) * np.linalg.norm(name))
                results.append((item, similarity))

        results = sorted(results, key=lambda x: x[1], reverse=True)[:size]

        return Response({
            'results': results
        })
