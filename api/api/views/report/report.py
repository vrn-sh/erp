import base64
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
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from api.models import Team, Manager
from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket

from api.api.views.report.generate_html import generate_vulns_detail, generate_vuln_figures

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE.replace("api/", ""))
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


class GeneratePDFReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Get the mission report generated with the mission' data.",
        manual_parameters=[
            openapi.Parameter(
                "mission",
                "path",
                required=True,
                type=openapi.TYPE_INTEGER,
                description="id of the mission"
            )
        ],
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

        object_url = s3.get_object_url(mission.bucket_name, object_name)
        return HttpResponseRedirect(redirect_to=object_url)

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
                   logo_path_2="https://www.hackmanit.de/templates/hackmanit2021j4/img/wbm_hackmanit.png",
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
        '''.format(vulnerabilities=generate_vulns_detail(mission),
                   stylesheet_path=ABSOLUTE_CSS_PATH)



class GenerateMDReportView(APIView):

    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]
    @swagger_auto_schema(
        operation_description="Get the mission report in Markdown generated with the mission' data.",
        manual_parameters=[
            openapi.Parameter(
                "mission",
                "path",
                required=True,
                type=openapi.TYPE_INTEGER,
                description="id of the mission"
            ),
            openapi.Parameter(
                "version",
                "",
                required=False,
                type=openapi.TYPE_NUMBER,
                description="Report version"
            )
        ],
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
        version = request.data.get("version")
        if not version:
            version = 1.0
        
        s3 = S3Bucket()
        s3.create_bucket(mission.bucket_name)

        dir_path = f'/tmp/{mission.bucket_name}'
        filepath = f'{dir_path}/REPORT.md'
        os.mkdir(dir_path, dir_fd=None)
        with open(filepath, 'w+') as fd:
            fd.write(
                self.generate_project_information(mission, version) +
                self.generate_condition_and_scopes(mission) +
                self.generate_weaknesses(mission)
            )
        object_name = f'report-{mission.title}.md'

        s3.upload_file(mission.bucket_name, file_path=filepath, file_name=object_name)
        rmtree(dir_path)

        object_url = s3.get_object_url(mission.bucket_name, object_name)
        return HttpResponseRedirect(redirect_to=object_url)
        
    def generate_project_information(self, mission: Mission, version):
        return f'''
# Project information
        
| | |
|-------------------|------------------:|
| Project executive | {mission.team.leader.auth.first_name} {mission.team.leader.auth.last_name} |
|                   | {mission.team.leader.auth.phone_number if mission.team.leader.auth.phone_number else ""}   |
|                   | {mission.team.leader.auth.email}          |
''' + self.generate_members(mission) \
            + f'''| Project Period    | {mission.start} - {mission.end} |
| Report Version    | {version}                            |'''

    def generate_members(self, mission: Mission):
        members_md = ""
        for i, member in enumerate(mission.team.members.all()):
            if i == 0:
                members_md = f'|    Members    | {member.auth.first_name} {member.auth.last_name}\n'
            else:
                members_md += f'|                    | {member.auth.first_name} {member.auth.last_name}\n'
        return members_md

    def generate_condition_and_scopes(self, mission: Mission):
        mrkdwn_scopes = ''

        for scope in mission.scope:
            mrkdwn_scopes += f"* ```{scope}```\n" if '*' in scope or '../' in scope or '$' in scope else f'* {scope}\n'

        return '''
# General Conditions and Scopes

The scope used during this mission were the following:
''' + mrkdwn_scopes

    def generate_weaknesses(self, mission: Mission):
        return '''
# Weaknesses


In the following sections, we list the identified weaknesses. Every weakness has an identification name
which can be used as a reference in the event of questions, or during the patching phase.
        ''' + self.generate_detailed_vulns(mission)

    def generate_detailed_vulns(self, mission: Mission):
        md = ""
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
            vuln_label = severity_key.upper() + f'0{severity_counter[severity_key]}' \
                if severity_counter[severity_key] < 10 else severity_counter[severity_key]
            md += f'''
### {vuln_label} | {vuln.title}
            
<h6>Exploitability Metrics</h6>

| | |
|:------------------------|----------------------:|
| Attack Vector (AV)      |      Network          |
| Attack Complexity (AC)  | Low                   |
| Privileges Required (PR)| None                  |
| User Interaction        | Required              |
| Subscore: {vuln.severity / 10 * 0.45}  | Subscore: {vuln.severity / 10 * 0.55}|
<h6>Impact Metrics</h6>
            
            
| | |
|:--------------------------|----------------------:|
| Confidentiality Impact (C)|      Low            |
| Integrity Impact (I)      | Low                 |
| Availability Impact (A)   | None                |
| Scope (S)                 | Unchanged           |
| Subscore: {vuln.severity / 10 * 0.45}  | Subscore: {vuln.severity / 10 * 0.55}|
            
**Overall CVSS Score for {vuln_label}: {vuln.severity}**
        
**General Description** {vuln.vuln_type.description}
        
**Weakness.** {vuln.description}
        
{generate_vuln_figures(vuln, md=True)}'''
        return md
