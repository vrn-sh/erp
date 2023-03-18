from warnings import warn
from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Admin, Pentester, Auth

from api.tests.helpers import create_random_pentester, create_random_admin, random_user_password, login_as


class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.admin: Admin = create_random_admin()

    def tearDown(self) -> None:
        self.user.delete()
        self.admin.delete()

    def test_create_and_update_valid_case(self) -> None:
        """
            logged in user can create a Note
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.admin.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        response = client.post(
            "/mission",
            format='json',
            data={
                'title': 'ERP - Eip team',
                'duration': '400.5',
                'start': '2022-01-01',
                'end': '2024-01-01',
            }
        )
        warn(f'resposne: {response.content}')
        self.assertEqual(response.status_code, 201)
        id: str = response.data['id']
        response = client.patch(
            f"/mission/{id}",
            format='json',
            data={'title': "Eurk"}
        )
        self.assertEqual(response.status_code, 200)

        response = client.delete(
            f"/mission/{id}",
        )
        warn(f'resposne: {response.status_code}, {response.content}')
        self.assertEqual(response.status_code, 204)
