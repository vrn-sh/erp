from warnings import warn
from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient
from api.models import Admin, Customer

from api.tests.helpers import create_random_customer, create_random_admin, random_user_password, \
        login_as

class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Customer = create_random_customer()
        self.admin: Admin = create_random_admin()

    def tearDown(self) -> None:
        self.user.delete()
        self.admin.delete()

    def test_create_and_update_valid_case(self) -> None:
        """
            logged in user can create a Note
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
                "/notes",
                format='json',
                data={'content': '#Exploit 1\n\nThis is an exploit.'}
                )
        self.assertEqual(response.status_code, 201)

        id: str = response.data['id']
        response = client.patch(
                f"/notes/{id}",
                format='json',
                data={'content': "It wasn't an exploit after all..."}
                )

        self.assertEqual(response.status_code, 200)


    def test_create_and_update_as_admin(self) -> None:
        """
            trying to test the same but logged in as an admin.
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
                "/notes",
                format='json',
                data={'content': '#Exploit 1\n\nThis is an exploit.'}
                )
        self.assertEqual(response.status_code, 201)

        id = response.data['id']
        response = client.patch(
                f"/notes/{id}",
                format='json',
                data={'content': "It wasn't an exploit after all..."}
                )

        self.assertEqual(response.status_code, 200)
