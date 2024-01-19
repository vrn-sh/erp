from io import BytesIO
import json
import warnings

from django.core.files.uploadedfile import SimpleUploadedFile

from django.core.management import call_command
from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient
from api.models.report.report import ReportHtml
from api.models import Manager, Pentester

from api.tests.helpers import create_random_pentester, create_random_manager, default_user_password, login_as

from api.models.mission import Mission


class ReportTestCase(TransactionTestCase):
    title = 'ERP - EIP Team'
    start = '2022-01-01'
    end = '2024-01-01'
    scope = ["*.djnn.sh", "10.10.0.1/24"]

    def setUp(self) -> None:
        # ensure vuln types are in database
        call_command('init_templates')
        self.user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

        self.fake_name: str = Faker().name()
        self.missions: list[Mission] = []

        # creating a team
        self.data: dict[str, str] = {
            'name': self.fake_name,
            'members': [self.user.id]
        }
        self.create_things_to_put_in_report()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()

    def create_things_to_put_in_report(self) -> None:
        """
            logged in user can create a Mission, update it then delete it
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        # preparing fake data

        resp = client.post('/team', format='json', data=self.data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = client.post(
            "/mission",
            format='json',
            data={
                'title': Faker().sentence(),
                'start': self.start,
                'end': self.end,
                'team': team_id,
                'scope': self.scope,
            }
        )
        self.assertEqual(response.status_code, 201)
        self.mission = response.data['id']

        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/vulnerability',
            format='json',
            data={
                'mission': self.mission,
                'title': Faker().sentence(),
                'vuln_type': 'Cross-Site Scripting (XSS)',
                'severity': 6.5,
                'images': [
                ]
            }
        )

    def test_list(self):
        self.create_things_to_put_in_report()

        self.test_academic_report(self.mission)
        self.test_yellow_report(self.mission)

        client: APIClient = APIClient()
        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get(
            '/download-report',
            format='json',
        )
        self.assertEqual(response.status_code, 200)

    def test_update(self):
        report_id = self.test_yellow_report(self.mission)

        client: APIClient = APIClient()
        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.patch(
            f'/download-report/{report_id}',
            format='json',
            data={
                'version': 44,
                'html_file': "<h2>This is an update</h2>"
            }
        )
        self.assertEqual(response.status_code, 200)

    
    def test_get_one(self):
        report_id = self.test_yellow_report(self.mission)

        client: APIClient = APIClient()
        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get(
            f'/download-report/{report_id}',
            format='json',
        )
        self.assertEqual(response.status_code, 200)

    
    def test_yellow_report(self, mission: str = None):
        #if os.environ.get("TEST", False) == '1' or os.environ.get('CI', False) == '1':
        #    return
        if mission is None:
            mission = self.mission
        client: APIClient = APIClient()
        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/download-report',
            format='json',
            data={
                'mission': mission,
                'template_name': 'yellow',
                'logo': 'data:image/png;base64,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',
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.data.get('id')

    def test_nasa_report(self, mission: str = None):

        #if os.environ.get("TEST", False) == '1' or os.environ.get('CI', False) == '1':
        #    return
        if mission is None:
            mission = self.mission
        client: APIClient = APIClient()
        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/download-report',
            format='json',
            data={
                'mission': mission,
                'template_name': 'NASA',
                'logo': 'data:image/png;base64,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',
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.data.get('id')

    def test_hackmanit_report(self, mission: str = None):
        #if os.environ.get("TEST", False) == '1' or os.environ.get('CI', False) == '1':
        #    return
        if mission is None:
            mission = self.mission
        client: APIClient = APIClient()
        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/download-report',
            format='json',
            data={
                'mission': mission,
                'template_name': 'hackmanit',
                'logo': 'data:image/png;base64,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',
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.data.get('id')


    def test_academic_report(self, mission: str = None):
        #if os.environ.get("TEST", False) == '1' or os.environ.get('CI', False) == '1':
        #    return
        if mission is None:
            mission = self.mission
        client: APIClient = APIClient()
        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post(
            '/download-report',
            format='json',
            data={
                'mission': mission,
                'template_name': 'hackmanit',
                'logo': 'data:image/png;base64,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',
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.data.get('id')

    def test_send_pdf_file(self):
        #if os.environ.get("TEST", False) == '1' or os.environ.get('CI', False) == '1':
        #    return
        report_id = self.test_academic_report()
        file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        file = BytesIO(file.read())

        client: APIClient = APIClient()
        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.put(
            f'/download-report/{report_id}',
            data={
                "file": file,
                "mission": self.mission,
            },
            format='multipart'
        )
        self.assertEqual(response.status_code, 200)
        updated_at = response.data.get('updated_at')
        self.assertNotEqual(
            updated_at,
            ReportHtml.objects.get(id=report_id).updated_at
        )
        # listing history
        response = client.get(
            '/download-report',
            format='json',
        )
        report = response.data.get('results')[0]
        self.assertEqual(updated_at, report.get('updated_at'))
        self.assertEqual(report['version'], 2.0)
