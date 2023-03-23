from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Manager, Pentester

from api.management.commands.init_builtin_vuln_types import Command
from api.models import Manager, Pentester

from api.tests.helpers import create_random_pentester, create_random_manager, random_user_password, \
    login_as

from warnings import warn

class VulnTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

        # Create builtin vuln types in test DB
        Command().handle()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_valid_vulnerability(self):
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/vulnerability',
            format='json',
            data={
                'title': 'String Error Terminatoin', # Typo made on purpose
                'vuln_type': 'XSS',
                'serverity': 6.5,
                'images': []
            }
        )

        warn(f'{response.json()}')

        self.assertEqual(response.status_code, 201)
        vuln_id = response.data['id']

        response = client.put(
            f'/vulnerability/{vuln_id}',
            format='json',
            data={
                'title': "String Error Termination",
                'last_editor': self.user.id
            }
        )

        self.assertEqual(response.status_code, 200)
