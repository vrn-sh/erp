from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status

class HunterViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_domain(self):
        url = reverse('hunt')
        response = self.client.get(url, {'domain': 'example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('domain', response)

    def test_verify_email(self):
        url = reverse('hunt')
        response = self.client.get(url, {'email': 'test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response)

    def test_get_email_finder(self):
        url = reverse('hunt')
        response = self.client.get(url, {'first_name': 'John', 'last_name': 'Doe', 'domain': 'example.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('email', response)

    def test_invalid_request(self):
        url = reverse('hunt')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response)
