import base64
import os
from typing import Type, List
import pdfkit
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

from api.models.report.report import ReportTemplate, ReportHtml
from api.models.report.academic_paper import AcademicTemplate
from api.models.report.generate_html import generate_vulns_detail, generate_vuln_figures

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path: str) -> bytes:
    """read an image and get its content as base64"""

    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())


class GeneratePDFReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Get the mission report generated with the mission' data.",
        manual_parameters=[
            openapi.Parameter(
                "mission",
                "body",
                required=True,
                type=openapi.TYPE_INTEGER,
                description="id of the mission"
            ),
            openapi.Parameter(
                name="template_name",
                in_="body",
                type=openapi.TYPE_INTEGER,
                description="name of the template. We have: 'NASA', 'hackmanit', 'academic', 'red4sec'."
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

        mission_id = request.query_params.get('mission')
        print(mission_id)
        if not mission_id:
            return Response({
                'error': 'No mission id provided. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)

        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({
                'error': f'No mission with id {mission_id}. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)
        version = request.query_params.get("version")
        if not version:
            version = 1.0
        download = request.query_params.get("download", False)

        template_name = request.data.get("template_name", "academic")
        template = ReportHtml(template=ReportTemplate.objects.get(name=template_name), mission=mission)

        s3 = S3Bucket()
        s3.create_bucket(mission.bucket_name)

        dir_path = f'/tmp/{mission.bucket_name}'

        if template_name == 'academic':
            filepath = AcademicTemplate().dump_report(mission, dir_path)
        else:
            filepath = self.dump_report(dir_path, template)
        object_name = f'report-{mission.title}.pdf'

        s3.upload_file(mission.bucket_name, file_path=filepath, file_name=object_name)
        rmtree(dir_path)

        object_url = s3.get_object_url(mission.bucket_name, object_name)
        return HttpResponseRedirect(redirect_to=object_url)

    def dump_report(self, dir_path: str, template: ReportHtml) -> str:
        """compile pages together to generate a report"""

        pages = [
            (f'{dir_path}/coverpage.html', template.generate_cover()),
            (f'{dir_path}/projectinfo.html', template.generate_project_info()),
            (f'{dir_path}/generalconditionsandscope.html', template.generate_condition_and_scope()),
            (f'{dir_path}/weaknesses.html', template.generate_weaknesses())
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


class GenerateMDReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]

    @swagger_auto_schema(
        operation_description="Get the mission report in Markdown generated with the mission' data.",
        manual_parameters=[
            openapi.Parameter(
                "mission",
                "params",
                required=True,
                type=openapi.TYPE_INTEGER,
                description="id of the mission"
            ),
            openapi.Parameter(
                "version",
                "params",
                required=False,
                type=openapi.TYPE_NUMBER,
                description="Report version"
            ),
            openapi.Parameter(
                "download",
                "params",
                required=False,
                type=openapi.TYPE_BOOLEAN,
                description="if you want a text format or Downloading the file"
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
        mission_id = request.query_params.get('mission')
        print(mission_id)
        if not mission_id:
            return Response({
                'error': 'No mission id provided. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)

        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({
                'error': f'No mission with id {mission_id}. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)
        version = request.query_params.get("version")
        if not version:
            version = 1.0
        download = request.query_params.get("download", False)

        md_content = self.generate_project_information(mission, version) + \
                     self.generate_condition_and_scopes(mission) + \
                     self.generate_weaknesses(mission)
        if not download or download == 'false':
            return Response(data=md_content, status=HTTP_200_OK)

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
        print("object url", object_url)
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
