import base64
import os
from datetime import datetime
from typing import Type, List
import pdfkit
from django.db.models import CharField
from django.http import HttpResponseRedirect
from shutil import rmtree

from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from drf_yasg.utils import APIView, swagger_auto_schema
from drf_yasg import openapi

from api.models import Team, Manager
from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE if os.getenv("PRODUCTION", 0) else DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path: str) -> bytes:
    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())


def generate_members(team: Team) -> str:
    members_html = ""
    for member in team.members.all():
        members_html += f"<p>{member.auth.first_name} {member.auth.last_name}</p>"
    return members_html


class GenerateReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Get the mission report generated with the mission' data.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['mission'],
            properties={
                'mission': openapi.Schema(type=openapi.TYPE_INTEGER,
                                           description="Id of mission"),
            },
        ),
        responses={
            "302": openapi.Response(
                description="Redirection to the minio storage of the pdf file.",
            )
        },
        security=['Bearer'],
        tags=['Report'],
    )
    def get(self, request):
        mission_id = request.data.get("mission")
        if not mission_id:
            return Response({
                'error': 'No mission id provided. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)
        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({
                'error': f'No mission with id {mission_id}. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)
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

    def dump_report(self, mission: Mission, dir_path) -> str:
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

        pdfkit.from_file(list(map(lambda a: a[0], pages)),
                         options={
                             "enable-local-file-access": None,
                             # 'footer-right': '[page] of [topage]',
                         },
                         output_path=path_to_file,
                         toc=toc,
                         cover=cover_page[0],
                         cover_first=True,)
        return path_to_file

    def generate_cover(self, mission: Mission, leader: Manager) -> str:
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
        <div class="figure">
        <!--
            <img src="data:image/jpeg;base64,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" 
            />
            <p>Figure 2: Successful session initialization with a missing <code>state</code> parameter</p>
        -->
        </div>
            '''.format(vuln_label_class=vuln_label_class,
                       vuln_label=vuln_label,
                       vuln_title=vuln.title,
                       subscore_1=vuln.severity * 0.45, # BS hihi chuuuut
                       subscore_2=vuln.severity * 0.55,
                       cvss_score=vuln.severity,
                       vuln_type_description=vuln.vuln_type.description,
                       vuln_description=vuln.description)
        return html

