from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Manager, Pentester

from api.tests.helpers import create_random_pentester, create_random_manager, random_user_password, \
    login_as

class VulnTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_valid_vulnerability(self):
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            'vulnerability',
            format='json',
            data={
                'author': self.user.id,
                'title': 'String Error Terminatoin', # Typo made on purpose
                'vuln_type': 'XSS'
            }
        )
        self.assertEqual(response.status_code, 201)
        vuln_id = response.data['id']
        response = client.patch(
            f'vulnerability/{vuln_id}',
            format='json',
            data={
                'title': "String Error Termination",
                'last_editor': self.user.id
            }
        )
        self.assertEqual(response.status_code, 200)
