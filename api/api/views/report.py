import base64
from logging import warning
import os
from datetime import datetime
from typing import Type, List
import pdfkit
from django.db.models import CharField
from django.http import HttpResponseRedirect
from shutil import rmtree

from rest_framework import permissions
from knox.auth import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from api.models import Team, Manager
from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE if os.getenv("PRODUCTION", '0') == '1' else DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path: str) -> bytes:
    """read an image and get its content as base64"""

    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())


def generate_members(team: Team) -> str:
    """generate members page"""

    members_html = ""
    for member in team.members.all():
        members_html += f"<p>{member.auth.first_name} {member.auth.last_name}</p>"
    return members_html


class GenerateReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Get the mission report generated with the mission' data.",
        manual_parameters=[openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['mission'],
            properties={
                'mission': openapi.Schema(type=openapi.TYPE_INTEGER,
                                          description="Id of mission"),
            },
        )],
        responses={
            "302": openapi.Response(
                description="Redirection to the minio storage of the pdf file.",
            )
        },
        security=['Bearer'],
        tags=['Report'],
    )
    def get(self, request):

        mission_id = request.GET.get("mission")
        if not mission_id:
            return Response({
                'error': 'No mission id provided. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)

        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({
                'error': f'No mission with id {mission_id}. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)

        warning(f'Creating bucket {mission.bucket_name}')

        s3 = S3Bucket()
        s3.create_bucket(mission.bucket_name)

        dir_path = f'/tmp/{mission.bucket_name}'
        filepath = self.dump_report(mission, dir_path)
        object_name = f'report-{mission.title}.pdf'

        s3.upload_file(mission.bucket_name, file_path=filepath, file_name=object_name)
        rmtree(dir_path)

        return HttpResponseRedirect(
            redirect_to=s3.client.presigned_get_object(
                bucket_name=mission.bucket_name,
                object_name=object_name,
            ))

    def dump_report(self, mission: Mission, dir_path: str) -> str:
        """compile pages together to generate a report"""

        pages = [
            (f'{dir_path}/coverpage.html', self.generate_cover(mission, mission.team.leader)),
            (f'{dir_path}/projectinfo.html', self.generate_project_info(mission, mission.team)),
            (f'{dir_path}/generalconditionsandscope.html', self.generate_condition_and_scope(mission.scope)),
            (f'{dir_path}/weaknesses.html', self.generate_weaknesses(mission))
        ]

        os.mkdir(dir_path, dir_fd=None)
        for path_page, html_content in pages:
            with open(path_page, 'w+') as fd:
                fd.write(html_content)

        path_to_file = f'{dir_path}/report.pdf'

        toc = {
            "toc-header-text": "Table of Contents",
            'xsl-style-sheet': f'{ABSOLUTE_DIR_STYLE}/toc.xsl'
        }

        cover_page = pages.pop(0)
        pdfkit.from_file(
            list(
                map(
                    lambda a: a[0], pages
                    )
                ),
                options={
                    "enable-local-file-access": None,
                },
                output_path=path_to_file,
                toc=toc,
                cover=cover_page[0],
                cover_first=True,
        )

        return path_to_file

    def generate_cover(self, mission: Mission, leader: Manager) -> str:
        """generate main cover of the report"""

        return '''
        <!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" type="text/css" href="{stylesheet_path}" />
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penetration Test Report: {mission_title}</title>
</head>
<body>
    <div class="cover-page">

       <img alt="logo-company" id="logo" src="{logo_path_1}" />
        <h1 id="mission-title">Penetration Test Report: <span>{mission_title}</span></h1>
        <div class="report-info">
            <p id="version">Version: 0.1</p>
            <p id="report-date">{report_date}</p>
        </div>
    </div>
        <footer id="footer">
            <p class="leader-name" id="leader-name">{leader_first_name} {leader_last_name}</p>
            <p>Phone: <span id="leader-phone-number"> {leader_phone_number}</span> | Email: <span id="leader-email">{leader_email}</span></p>
        </footer>
</body>
</html>
        '''.format(mission_title=mission.title,
                   report_date=datetime.now().date().__str__(),
                   leader_first_name=leader.auth.first_name,
                   leader_last_name=leader.auth.last_name,
                   leader_phone_number=leader.auth.phone_number,
                   leader_email=leader.auth.email,
                   stylesheet_path=ABSOLUTE_CSS_PATH,
                   logo_path_1=f'{ABSOLUTE_DIR_STYLE}/hackmanit-logo-2.png')

    def generate_project_info(self, mission: Mission, team: Team) -> str:
        return '''
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Information</title>
    <link rel="stylesheet" type="text/css" href="{stylesheet_path}" />
</head>

<body>

    <header>
        <div class="inline-title-logo">
            <img alt="logo-company" id="logo"
                src="https://www.hackmanit.de/templates/hackmanit2021j4/img/wbm_hackmanit.png" />
            <p>Project Information</p>
        </div>
        <div class="divider-x"></div>
    </header>
    <div class="page">
        <h1>Project Information</h1>
        <div class="project-info-table">
            <div class="row">
                <div class="col-left">
                    <p>Project executive:</p>
                </div>
                <div class="col-right">
                    <p>{leader_first_name} {leader_last_name}</p>
                    <div class="row">
                        <div class="sub-col-left">
                            <p>Phone:</p>
                        </div>
                        <div class="sub-col-right">
                            <p>{leader_phone_number}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="sub-col-left">
                            <p>Email:</p>
                        </div>
                        <div class="sub-col-right">
                            <p>{leader_email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-left">
                    <p>Project members:</p>
                </div>
                <div class="col-right">
                    {members}
                </div>
            </div>
            <div class="row">
                <div class="col-left">
                    <p>Project period:</p>
                </div>
                <div class="col-right">
                    <p>{mission_start} - {mission_end}</p>
                </div>
            </div>
            <div class="row">
                <div class="col-left">
                    <p>Version of the report:</p>
                </div>
                <div class="col-right">
                    <p>0.1</p>
                </div>
            </div>
        </div>
    </div>

</body>

</html>
        '''.format(leader_first_name=team.leader.auth.first_name,
                   leader_last_name=team.leader.auth.last_name,
                   leader_phone_number=team.leader.auth.phone_number,
                   leader_email=team.leader.auth.email,
                   members=generate_members(team),
                   mission_start=mission.start,
                   mission_end=mission.end,
                   logo_path_2=f"data:image/png;base64,{get_image_file_as_base64_data(ABSOLUTE_DIR_STYLE + '/hackmanit-logo-2.png')}",
                   stylesheet_path=ABSOLUTE_CSS_PATH)

    def generate_condition_and_scope(self, scope: CharField) -> str:
        scope_html = ""
        for s in scope:
            scope_html += f"<li><code>{s}</code></li>" if "*" in s or "$" in s else f"<li>{s}</li>"

        return '''
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Conditions and Scope</title>
    <link rel="stylesheet" type="text/css" href="{stylesheet_path}" />
</head>

<body>
    <header>
        <div class="inline-title-logo">
            <img alt="logo-company" id="logo"
                src="https://www.hackmanit.de/templates/hackmanit2021j4/img/wbm_hackmanit.png" />
            <p>General Conditions and Scope</p>
        </div>
        <div class="divider-x"></div>
    </header>
    <main class="scopes">
        <h1>General Condition and Scope</h1>
        <div class="section-text">
            <p>The scope allowed was the following:</p>
            <ul>{scopes}</ul>
        </div>
    </main>
</body>

</html>
        '''.format(scopes=scope_html,
                   stylesheet_path=ABSOLUTE_CSS_PATH)

    def generate_weaknesses(self, mission: Mission) -> str:
        return '''
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="{stylesheet_path}" />
    <title>Weaknesses</title>
</head>

<body>
    <header>
        <div class="inline-title-logo">
            <img alt="logo-company" id="logo"
                src="https://www.hackmanit.de/templates/hackmanit2021j4/img/wbm_hackmanit.png" />
            <p>Weaknesses</p>
        </div>
        <div class="divider-x"></div>
    </header>
    <main>
        <h1>Weaknesses</h1>
        <div class="section-text">
            <p>In the following sections, we list the identified weaknesses. Every weakness has an identification name
                which can be used as a reference in the event of questions, or during the
                patching phase.</p>
        </div>
        {vulnerabilities}
    </main>
</body>

</html>
        '''.format(vulnerabilities=self.generate_vulns_detail(mission),
                   stylesheet_path=ABSOLUTE_CSS_PATH)

    def generate_vulns_detail(self, mission: Mission) -> str:
        html = ""
        severity_counter = {"l": 0, "m": 0, "h": 0, "c": 0}
        severity_key = 'l'
        vulns = Vulnerability.objects.filter(mission_id=mission.id)
        for vuln in vulns.all():
            if 0 <= vuln.severity <= 3.9:
                severity_key = "l"
            elif 4 <= vuln.severity <= 6.9:
                severity_key = "m"
            elif 7 <= vuln.severity <= 8.9:
                severity_key = "h"
            elif 9 <= vuln.severity <= 10:
                severity_key = "c"
            severity_counter[severity_key] += 1
            vuln_label_class = f'{severity_key}-wkns'
            vuln_label = severity_key.upper() + f'0{severity_counter[severity_key]}' \
                if severity_counter[severity_key] < 10 else severity_counter[severity_key]

            html += '''
        <h2><span class="{vuln_label_class}">{vuln_label}</span>{vuln_title}</h2>
        <table class="main-table">
            <thead>
                <tr>
                    <th>Exploitability Metrics</th>
                    <th>Impact Metrics</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <table class="sub-table">
                            <tr>
                                <td>Attack Vector (AV)</td>
                                <th>Network</th>
                            </tr>
                            <tr>
                                <td>Attack Complexity (AC)</td>
                                <th>Low</th>
                            </tr>
                            <tr>
                                <td>Privileges Required (PR)</td>
                                <th>Low</th>
                            </tr>
                            <tr>
                                <td>User Interaction</td>
                                <th>Required</th>
                            </tr>
                        </table>
                    </td>
                    <td>
                        <table class="sub-table">
                            <tr>
                                <td>Confidentiality Impact (C)</td>
                                <th>Low</th>
                            </tr>
                            <tr>
                                <td>Integrity Impact (I)</td>
                                <th>Low</th>
                            </tr>
                            <tr>
                                <td>Availability Impact (A)</td>
                                <th>None</th>
                            </tr>
                            <tr>
                                <td>Scope (S)</td>
                                <th>Unchanged</th>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>Subscore: <span>{subscore_1}</span></td>
                    <td>Subscore: <span>{subscore_2}</span></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th>Overall CVSS Score for <span class="{vuln_label_class}">{vuln_label}</span></th>
                    <td><span>{cvss_score}</span></th>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div class="section-text">
            <p><span>General Description.</span>{vuln_type_description}
            </p>
            <p><span>Weaknessess.</span>{vuln_description}</p>
        </div>
        {images}
            '''.format(vuln_label_class=vuln_label_class,
                       vuln_label=vuln_label,
                       vuln_title=vuln.title,
                       subscore_1=vuln.severity * 0.45,  # BS hihi chuuuut
                       subscore_2=vuln.severity * 0.55,
                       cvss_score=vuln.severity,
                       vuln_type_description=vuln.vuln_type.description,
                       vuln_description=vuln.description,
                       images=self.generate_vuln_figures(vuln))
        return html

    def generate_vuln_figures(self, vuln: Vulnerability) -> str:
        figure_html = ""
        s3_client = S3Bucket()
        for i, image in enumerate(vuln.images):
            if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
                continue

            figure_html += '''
        <div class="figure">
            <img src="{img_path}"/>
            <p>{description}</p>
        </div>
            '''.format(img_path=s3_client.get_object_url('rootbucket', image),
                       description=f"Figure {i + 1}")  # well, Figure 0 is a bit weird..
        return figure_html
