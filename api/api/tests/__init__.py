
from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient

from api.tests.helpers import create_random_pentester, create_random_manager, default_user_password, \
        login_as


# import unit tests from other files here
from .notes_tests import *
from .vuln_tests import *
from .mission_tests import *
from .report_tests import *


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
        """any valid pentester account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get('/ping')
        self.assertEqual(response.status_code, 200) # type: ignore

    def test_can_login_manager_account(self) -> None:
        """any valid manager account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

    def test_can_logout_account(self) -> None:
        """any account should be able to log out"""

        client = APIClient()
        auth_token = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post('/logout')
        self.assertEqual(response.status_code, 204) # type: ignore

    def test_unknown_account(self) -> None:
        """unknown account should get 400"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': 'email@email.com', 'password': '1234'}
                )
        self.assertEqual(response.status_code, 400) # type: ignore

    def test_wrong_password(self) -> None:
        """wrong password should get 400"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': self.manager.auth.email, 'password': '1234'}
                )
        self.assertEqual(response.status_code, 400) # type: ignore


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
            "password": default_user_password()
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

class CRUDManagerTestCase(TransactionTestCase):
    """tests CRUD for manager accounts"""

    def setUp(self) -> None:
        self.manager = create_random_manager()
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

    def tearDown(self) -> None:
        response = self.client.post('/logout')
        self.assertEqual(response.status_code, 204)
        self.manager.delete()

    def test_create_a_manager(self):
        """a manager should be created no problem"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_manager(self):
        """we should be able to update a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)
        name = fake.name()
        update_data = {
            "auth": {
                "username": name.split(' ')[0],
                "email": fake.email(),
                "first_name": name.split(' ')[0],
                "last_name": name.split(' ')[1],
                "role": 1,
                "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.get(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/manager/{manager_id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_manager(self):
        """we should be able to delete a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.delete(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 204)


class CRUDManagerTestCase(TransactionTestCase):
    """tests CRUD for manager accounts"""

    def setUp(self) -> None:
        self.manager = create_random_manager()
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

    def tearDown(self) -> None:
        response = self.client.post('/logout')
        self.assertEqual(response.status_code, 204)
        self.manager.delete()

    def test_create_a_manager(self):
        """a manager should be created no problem"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_manager(self):
        """we should be able to update a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)
        name = fake.name()
        update_data = {
            "auth": {
                "username": name.split(' ')[0],
                "email": fake.email(),
                "first_name": name.split(' ')[0],
                "last_name": name.split(' ')[1],
                "role": 1,
                "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.get(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/manager/{manager_id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_manager(self):
        """we should be able to delete a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.delete(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 204)


class CRUDTeamTestCase(TransactionTestCase):
    """
        tests scenarios for Team CRUD

        1. create a team as manager
        2. should not create team as pentester
        3. update team settings
        4. delete team
        5. should fail to create team if wrong input is supplied
        6. pentester should be able to read data
    """

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

        self.uri = '/team'

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_a_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)


    def test_fail_if_pentester_creates_team(self):

        # login as pentester
        self.client = APIClient()
        self.auth_token = login_as(self.user.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 403)


    def test_update_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = self.client.patch(
            f'{self.uri}/{team_id}',
            format='json',
            data={
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_delete_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = self.client.delete(
            f'{self.uri}/{team_id}',
            format='json',
        )
        self.assertEqual(response.status_code, 204)

    def test_fail_if_wrong_input(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'members': [fake_name]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 400)

    def test_pentester_can_read_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']

        # logging in as pentester
        self.pentester_client = APIClient()
        auth_token = login_as(self.user.auth.email, default_user_password())
        self.pentester_client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}') # type: ignore

        resp = self.pentester_client.get(f'{self.uri}/{team_id}', format='json')
        self.assertEqual(resp.status_code, 200)
