import os
import warnings
from datetime import date
from shutil import rmtree

from django.core.management import call_command
from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient
from api.models import Manager, Pentester, Auth

from api.tests.helpers import create_random_pentester, create_random_manager, default_user_password, login_as

from api.models.mission import Mission
from api.models.report.report import ReportHtml, ReportTemplate

from api.models.report.academic_paper import AcademicTemplate


class TeamTestCase(TransactionTestCase):
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

        # creating a team
        self.data: dict[str, str] = {
            'name': self.fake_name,
            'members': [self.user.id]
        }

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()

    def create_valid_mission(self) -> None:
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
                'title': self.title,
                'start': self.start,
                'end': self.end,
                'team': team_id,
                'scope': self.scope,
            }
        )
        self.assertEqual(response.status_code, 201)
        return response.data['id']

    def test_create_and_update_valid_case(self) -> None:
        mission_id = self.create_valid_mission()
        report = ReportHtml(mission=Mission.objects.get(pk=mission_id),
                            template=ReportTemplate.objects.get(name='red4sec'))
        expected = \
            '''<div class="cover-page">
<svg id="wave-top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
   <defs>
       <linearGradient id="url(#sw-gradient-1)" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 172, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 179, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-1)" fill-opacity="0.7" d="M0,160L180,96L360,192L540,224L720,288L900,0L1080,128L1260,128L1440,192L1440,0L1260,0L1080,0L900,0L720,0L540,0L360,0L180,0L0,0Z"></path>
   <defs>
       <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 142, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 85, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-0)" fill-opacity="0.7" d="M0,192L180,192L360,32L540,96L720,64L900,96L1080,224L1260,160L1440,96L1440,0L1260,0L1080,0L900,0L720,0L540,0L360,0L180,0L0,0Z"></path>        </svg>
<h1>{team_name}</h1>

<svg id="wave-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
   <defs>
       <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 142, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 85, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-0)" fill-opacity="1" d="M0,64L205.7,128L411.4,32L617.1,192L822.9,128L1028.6,160L1234.3,32L1440,288L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"></path>

   <defs>
       <linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 172, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 179, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-1)" fill-opacity="0.7" d="M0,64L205.7,224L411.4,256L617.1,256L822.9,224L1028.6,224L1234.3,32L1440,256L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"></path></svg>
<div class="bandeau">
   <h2 id="mission-title">{mission_title}</h2>
   <div class="report-info">
       <p id="version">Version: {report_version}</p>
       <p id="report-date">{report_date}</p>
   </div>
</div>

</div>'''.format(
                mission_title=self.title,
                report_version="1.0",
                report_date=date.today().strftime('%Y-%m-%d'),
                team_name=self.fake_name)
        self.assertEqual(
            report.generate_cover().replace('\t', ''),
            expected.replace('\t', '')
        )
        # Yes there is no tests bc I'm lazy but just to make sure it does not throw any error
        pages = [
            (report.generate_cover()),
            (report.generate_project_info()),
            (report.generate_condition_and_scope()),
            (report.generate_weaknesses())
        ]
        # AcademicTemplate().dump_report(Mission.objects.get(pk=mission_id), dir_path="/tmp/test-lol")
        # rmtree("/tmp/test-lol")
