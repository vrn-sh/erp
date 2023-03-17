from logging import warn
from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Manager, Pentester

from api.tests.helpers import create_random_pentester, create_random_manager, random_user_password, login_as

class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()
        self.uri = '/note'

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_and_update_valid_case(self) -> None:
        """
            logged in user can create a Note
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
            self.uri,
            format='json',
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.user.id}
        )
        self.assertEqual(response.status_code, 201)

        id: str = response.data['id']
        response = client.patch(
            f"{self.uri}/{id}",
            format='json',
            data={'content': "It wasn't an exploit after all...", "author": self.user.id}
        )

        self.assertEqual(response.status_code, 200)


    def test_create_and_update_as_manager(self) -> None:
        """
            trying to test the same but logged in as an manager.
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.manager.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
            self.uri,
            format='json',
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.user.id}
        )
        self.assertEqual(response.status_code, 201)

        id = response.data['id']
        response = client.patch(
            f"{self.uri}/{id}",
            format='json',
            data={'content': "It wasn't an exploit after all...", 'author': self.user.id}
        )

        self.assertEqual(response.status_code, 200)

    def test_patch_invalid_case(self):
        """
            A user creates a notes, and an other one tries to patch it.
        """

        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
            self.uri,
            format='json',
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.user.id}
        )

        auth_token: str = login_as(self.other_user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        notes_id = response.data.get('id')

        response = client.patch(
            f"{self.uri}/{notes_id}",
            format='json',
            data={"content": "Je suis un petit saboteur mouihihihihih"}
        )
        self.assertEqual(response.status_code, 403)
