from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models.client_infos import ClientInfo
from api.models.mission import Mission
from api.serializers.client_infos import ClientInfoSerializer


class ClientInfoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.mission = Mission.objects.create(name='Test Mission', description='Test Description')
        self.client_info = ClientInfo.objects.create(mission=self.mission, company_name='Test Company', creation_date='2022-01-01', nb_employees=100, occupation='Test Occupation', legal_entity='Test Legal Entity', brief_description='Test Description')

    def test_create_client_info(self):
        url = reverse('client-info-create')
        data = {'mission': self.mission.pk, 'company_name': 'New Test Company', 'creation_date': '2022-01-01', 'nb_employees': 200, 'occupation': 'New Test Occupation', 'legal_entity': 'New Test Legal Entity', 'brief_description': 'New Test Description'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ClientInfo.objects.count(), 2)
        self.assertEqual(ClientInfo.objects.get(pk=response.data['id']).company_name, 'New Test Company')

    def test_retrieve_client_info(self):
        url = reverse('client-info-detail', args=[self.client_info.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ClientInfoSerializer(self.client_info).data)

    def test_update_client_info(self):
        url = reverse('client-info-update', args=[self.client_info.pk])
        data = {'mission': self.mission.pk, 'company_name': 'Updated Test Company', 'creation_date': '2022-01-01', 'nb_employees': 200, 'occupation': 'Updated Test Occupation', 'legal_entity': 'Updated Test Legal Entity', 'brief_description': 'Updated Test Description'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ClientInfo.objects.get(pk=self.client_info.pk).company_name, 'Updated Test Company')

    def test_delete_client_info(self):
        url = reverse('client-info-delete', args=[self.client_info.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ClientInfo.objects.count(), 0)
