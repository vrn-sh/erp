from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Manager, Pentester

from api.management.commands.init_builtin_vuln_types import Command
from api.models import Manager, Pentester
from api.models.vulns import VulnType

from api.tests.helpers import create_mission, create_random_pentester, create_random_manager, default_user_password, \
    login_as

from warnings import warn
from django.core.management import call_command



class VulnTestCase(TransactionTestCase):

    def setUp(self) -> None:

        # ensure vuln types are in database
        call_command('init_builtin_vuln_types')

        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()


    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()


    def test_create_valid_vulnerability(self):
        client: APIClient = APIClient()

        mission = create_mission(self.manager, [self.user, self.other_user])

        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/vulnerability',
            format='json',
            data={
                'mission': mission.id,
                'title': 'String Error Terminatoin', # Typo made on purpose
                'vuln_type': 'Cross-Site Scripting (XSS)',
                'severity': 6.5,
                'screenshots': []
            }
        )

        self.assertEqual(response.status_code, 201)
        vuln_id = response.data['id']

        response = client.patch(
            f'/vulnerability/{vuln_id}',
            format='json',
            data={
                'title': "String Error Termination",
            }
        )

        self.assertEqual(response.status_code, 200)
