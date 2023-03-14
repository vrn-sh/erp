import warnings

from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient

from api.tests.helpers import create_random_pentester, create_random_admin, random_user_password, \
        login_as


# import unit tests from other files here
from .notes_tests import *
from .vuln_tests import *


class AuthTestCase(TransactionTestCase):

    """
        Tests if accounts can be logged in (admin or pentester) and logged out
        also tests for wrong password
    """

    def setUp(self) -> None:
        self.user = create_random_pentester()
        self.admin = create_random_admin()

    def tearDown(self) -> None:
        self.user.delete()
        self.admin.delete()

    def test_can_login_pentester_account(self) -> None:
        """any valid pentester account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get('/ping')
        self.assertEqual(response.status_code, 200) # type: ignore

    def test_can_login_admin_account(self) -> None:
        """any valid admin account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.admin.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

    def test_can_logout_account(self) -> None:
        """any account should be able to log out"""

        client = APIClient()
        auth_token = login_as(self.admin.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get('/logout')
        self.assertEqual(response.status_code, 200) # type: ignore

    def test_unknown_account(self) -> None:
        """unknown account should get 404"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': 'email@email.com', 'password': '1234'}
                )
        self.assertEqual(response.status_code, 404) # type: ignore

    def test_wrong_password(self) -> None:
        """wrong password should get 403"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': self.admin.auth.email, 'password': '1234'}
                )
        self.assertEqual(response.status_code, 403) # type: ignore


class RegisterTestCase(TransactionTestCase):
    """
        Tests account registration feature
    """

    def test_can_register_new_pentester(self) -> None:
        """a new pentester should be able to be registered!"""

        client = APIClient()
        fake = Faker()

        name = fake.name()
        registration_settings = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 201) # type: ignore


    def test_invalid_data(self) -> None:
        """random invalid date should not be accepted"""

        client = APIClient()
        registration_settings = {
                'first_name': 'kendrick',
                }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 400) # type: ignore


class CrudpentesterTestCase(TransactionTestCase):
    """tests CRUD for pentester accounts"""

    def setUp(self) -> None:
        self.admin = create_random_admin()
        self.client = APIClient()
        self.auth_token = login_as(self.admin.auth.email, random_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

    def tearDown(self) -> None:
        response = self.client.get('/logout')
        self.assertEqual(response.status_code, 200)
        self.admin.delete()

    def test_create_a_pentester(self):
        """a pentester should be created no problem"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/pentester', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_pentester(self):
        """we should be able to update a pentester"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
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
                "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        pentester_id: str = resp.data["id"] # type: ignore
        resp = self.client.get(f'/pentester/{pentester_id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/pentester/{pentester_id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_pentester(self):
        """we should be able to delete a pentester"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": random_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/pentester', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        pentester_id: str = resp.data["id"] # type: ignore
        resp = self.client.delete(f'/pentester/{pentester_id}', format='json')
        self.assertEqual(resp.status_code, 204)
