from warnings import warn
from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Admin, Pentester

from api.tests.helpers import create_random_pentester, create_random_admin, random_user_password, login_as

class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.admin: Admin = create_random_admin()

    def tearDown(self) -> None:
        self.user.delete()
        self.admin.delete()
        self.other_user.delete()

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
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.user.id}
        )
        self.assertEqual(response.status_code, 201)

        id: str = response.data['id']
        response = client.patch(
            f"/notes/{id}",
            format='json',
            data={'content': "It wasn't an exploit after all...", "author": self.user.id}
        )
        self.assertEqual(response.status_code, 200)


    def test_create_and_update_as_admin(self) -> None:
        """
            trying to test the same but logged in as an admin.
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.admin.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
            "/notes",
            format='json',
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.admin.id}
        )
        self.assertEqual(response.status_code, 201)

        id = response.data['id']
        response = client.patch(
            f"/notes/{id}",
            format='json',
            data={'content': "It wasn't an exploit after all...", 'author': self.admin.id}
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
            "/notes",
            format='json',
            data={'content': '#Exploit 1\n\nThis is an exploit.', 'author': self.user.id}
        )

        auth_token: str = login_as(self.other_user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        notes_id = response.data.get('id')

        response = client.patch(
            f"/notes/{notes_id}",
            format='json',
            data={"content": "Je suis un petit saboteur mouihihihihih"}
        )
        self.assertEqual(response.status_code, 403)
