from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import MailingListItem


class MailingListViewsetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('mailinglistitem-list')

        MailingListItem.objects.create(email="existing@example.com")

    def test_create_mailing_list_item(self):
        data = {"email": "test@example.com"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(MailingListItem.objects.filter(
            email="test@example.com").exists())

    def test_create_duplicate_email(self):
        data = {"email": "existing@example.com"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_invalid_email(self):
        data = {"email": "invalidemail"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_valid_new_email(self):
        data = {"email": "newemail@example.com"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(MailingListItem.objects.filter(
            email="newemail@example.com").exists())

    def test_create_empty_email(self):
        data = {"email": ""}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_null_email(self):
        data = {"email": None}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
