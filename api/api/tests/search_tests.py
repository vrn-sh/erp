from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch
from .models import Manager, Mission, Pentester, Team, Vulnerability


class SearchViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

    def test_search_with_query(self):
        url = reverse('search')
        query = 'test'
        response = self.client.get(url, {'q': query})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('results' in response.data)
        self.assertEqual(len(response.data['results']), 0)

        mission = Mission.objects.create(title='Test mission')
        mission.teams.add(Team.objects.create(name='Test team'))
        response = self.client.get(url, {'q': query})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('results' in response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], mission.id)
        self.assertEqual(response.data['results'][0]['model'], 'Mission')
        self.assertEqual(response.data['results'][0]['title'], mission.title)

        manager = Manager.objects.create(auth=self.user)
        response = self.client.get(url, {'q': query, 'search_managers': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('results' in response.data)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], manager.id)
        self.assertEqual(response.data['results'][0]['model'], 'Manager')
        self.assertEqual(response.data['results'][0]['username'], self.user.username)

    def test_search_without_query(self):
        url = reverse('search')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('error' in response.data)

    @patch('search.views.Mission.objects.filter')
    @patch('search.views.Vulnerability.objects.filter')
    @patch('search.views.Manager.objects.filter')
    @patch('search.views.Pentester.objects.filter')
    @patch('search.views.Team.objects.none')
    def test_fetch(self, mock_team, mock_pentester, mock_manager, mock_vulnerability, mock_mission):
        query = 'test'
        user = self.user

        self.assertEqual(SearchView().fetch(Mission, query, user), mock_mission.return_value)
        mock_mission.assert_called_once_with(Q(title__icontains=query))

        self.assertEqual(SearchView().fetch(Vulnerability, query, user), mock_vulnerability.return_value)
        mock_vulnerability.assert_called_once_with(Q(title__icontains=query))

        self.assertEqual(SearchView().fetch(Manager, query, user, search_managers=True), mock_manager.return_value)
        mock_manager.assert_called_once_with(Q(auth__username__icontains=query))

        self.assertEqual(SearchView().fetch(Pentester, query, user), mock_pentester.return_value)
        mock_pentester.assert_called_once_with(Q())

        self.assertEqual(SearchView().fetch(Team, query, user), mock_team.return_value)
        mock_team.assert_called_once_with(Q(teams__name__icontains=query))
