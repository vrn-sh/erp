import os
import logging
from datetime import datetime

from faker import Faker

from django.conf import settings
from django.db import transaction
from django.db.transaction import TransactionManagementError
from django.test import TransactionTestCase, TestCase
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient

from api.tests.helpers import create_random_pentester, create_random_manager, random_user_password, login_as


class AuthTestCase(TransactionTestCase):

    """
        Tests if accounts can be logged in (manager or pentester) and logged out
        also tests for wrong password
    """

    def setUp(self) -> None:
        self.user = create_random_pentester()
        self.manager = create_random_manager()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()

    def test_can_login_pentester_account(self) -> None:
        client = APIClient()
        auth_token = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get(f'/ping')
        self.assertEqual(response.status_code, 200)

    def test_can_login_manager_account(self) -> None:
        client = APIClient()
        auth_token = login_as(self.manager.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

    def test_can_logout_account(self) -> None:
        client = APIClient()
        auth_token = login_as(self.manager.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get(f'/logout')
        self.assertEqual(response.status_code, 200)

    def test_unknown_account(self) -> None:
        client = APIClient()
        response = client.post('/login', format='json', data={'email': 'email@email.com', 'password': '1234'})
        self.assertEqual(response.status_code, 404)

    def test_wrong_password(self) -> None:
        client = APIClient()
        response = client.post('/login', format='json', data={'email': self.manager.auth.email, 'password': '1234'})
        self.assertEqual(response.status_code, 403)


class RegisterTestCase(TransactionTestCase):
    """
        Tests account registration feature
    """

    def test_can_register_new_pentester(self) -> None:
        client = APIClient()
        fake = Faker()

        name = fake.name()
        registration_settings = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "two_factor": {
              "enabled": True,
              "method": 1
            },
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 201)

    def test_invalid_data(self) -> None:
        client = APIClient()
        registration_settings = {
                'first_name': 'kendrick',
                }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 400)


class CrudPentesterTestCase(TransactionTestCase):
    def setUp(self) -> None:
        self.manager = create_random_manager()
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, random_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}')

    def tearDown(self) -> None:
        response = self.client.get(f'/logout')
        self.assertEqual(response.status_code, 200)
        self.manager.delete()

    def test_create_a_pentester(self):
        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "two_factor": {
              "enabled": True,
              "method": 1
            },
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/pentester', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_pentester(self):
        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "two_factor": {
              "enabled": True,
              "method": 1
            },
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/pentester', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)
        name = fake.name()
        update_data = {
            "auth": {
                "username": name.split(' ')[0],
                "email": fake.email(),
                "first_name": name.split(' ')[0],
                "last_name": name.split(' ')[1],
                "role": 1,
                "two_factor": {
                  "enabled": False,
                  "method": 1
                },
                "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        id = resp.data["id"]
        resp = self.client.get(f'/pentester/{id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/pentester/{id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_pentester(self):
        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "two_factor": {
              "enabled": True,
              "method": 1
            },
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/pentester', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        id = resp.data["id"]
        resp = self.client.delete(f'/pentester/{id}', format='json')
        self.assertEqual(resp.status_code, 204)
