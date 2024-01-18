import base64
from io import BytesIO
import os
from typing import Type, List
from uuid import uuid4
from django.http import HttpResponseRedirect
from django.core.files.base import File
from shutil import rmtree

from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, JSONParser
from knox.auth import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK
from rest_framework.views import APIView
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
from api.pagination import CustomPagination
from api.serializers.report import ReportHtmlSerializer

from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket

from api.models.report.report import ReportTemplate, ReportHtml
from api.models.report.generate_html import generate_vuln_figures

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path: str) -> bytes:
    """read an image and get its content as base64"""

    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())

class GeneratePDFReportView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [TokenAuthentication]
    serializer_class = ReportHtmlSerializer
    pagination_class = CustomPagination
    parser_classes = [MultiPartParser, JSONParser]
    queryset = ReportHtml.objects.all().order_by('updated_at')

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
            ),
            openapi.Parameter(
                "logo",
                "body",
                required=False,
                type=openapi.TYPE_OBJECT,
                description="logo in base64"
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
    def create(self, request, *args, **kwargs):
        mission_id = request.data.get('mission')
        if not mission_id:
            return Response({
                'error': 'No mission id provided. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)

        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({
                'error': f'No mission with id {mission_id}. Report couldn\'t be generated',
            }, status=HTTP_404_NOT_FOUND)
        request.data['template'] = ReportTemplate.objects.filter(name=request.data.get('template_name', 'hackmanit')).first().pk
        request.data.pop('template_name')

        if request.data.get('logo', ''):
            request.data['logo'] = S3Bucket().upload_single_image(request.data.get('logo', ''))
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        print("kwargs", kwargs)
        print("request", request.query_params)
        report = ReportHtml.objects.filter(pk=kwargs.get('pk')).first()
        if not report:
            return Response({
                'error': f'No report with id {kwargs.get("pk")}. Report couldn\'t be updated',
            }, status=HTTP_404_NOT_FOUND)
        if html_file := request.FILES.get('html_file', None):
            print("pdf_file", report.pdf_file)
            filename = f'report-{report.mission.pk}-{uuid4().__str__()}.pdf'
            filepath = f'/tmp/{filename}'
            HTML(string=html_file.read().decode('utf-8')).write_pdf(
                filename,
                stylesheets=[CSS(string=report.template.css_style)],
                font_config=FontConfiguration())
            s3_client = S3Bucket()
            s3_client.upload_file('rootbucket', filepath)
            request.data.pop('html_file')
        if file := request.FILES.get('file', None):
            pdf_file = S3Bucket().upload_stream(
                'rootbucket',
                f'report-{report.mission.pk}-{uuid4().__str__()}',
                BytesIO(file.read()) if isinstance(file, File) else file,
                mime_type='application/pdf')
            request.data['pdf_file'] = S3Bucket().get_object_url('rootbucket', pdf_file.object_name)
        if request.data.get('logo', ''):
            request.data['logo'] = S3Bucket().upload_single_image(request.data.get('logo', ''))
        return super().update(request, *args, **kwargs)


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

        if '1' in  (os.environ.get('TEST', '0') == '1', os.environ.get('CI', '0')):
            return Response({
                'message': 'mock pdf generation, all good :)'
            }, status=HTTP_200_OK)


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
                md_content
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
