# Search across all models

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

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

    def search(self, request):
        query = request.query_params.get('q', None)
        if query is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        look_for_team = request.query_params.get('look_for_team', False)

        # Search across all models
        managers = Manager.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query)
        )
        pentesters = Pentester.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query)
        )
        teams = Team.objects.none()
        if look_for_team:
            teams = Team.objects.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query)
            )
        vulnerabilities = Vulnerability.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(impact__icontains=query) |
            Q(recommendation__icontains=query)
        )
        missions = Mission.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(impact__icontains=query) |
            Q(recommendation__icontains=query)
        )

        return Response({
            'managers': managers,
            'pentesters': pentesters,
            'teams': teams,
            'vulnerabilities': vulnerabilities,
            'missions': missions
        })
