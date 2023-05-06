import base64
import os
from datetime import datetime
from typing import Type, List
import pdfkit
from django.http import HttpResponseRedirect
from shutil import rmtree

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView

from api.models import Team, Manager
from api.models.mission import Mission
from api.services.s3 import S3Bucket

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE if os.getenv("PRODUCTION", 0) else DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path):
    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())


def generate_members(team: Team):
    members_html = ""
    for member in team.members.all():
        members_html += f"<p>{member.auth.first_name} {member.auth.last_name}</p>"
    return members_html


class GenerateReportView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: List[Type[TokenAuthentication]] = []

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
        bucket_name = f'mission{mission_id}'
        s3.create_bucket(bucket_name)
        dir_path = f'/tmp/{bucket_name}'
        filepath = self.dump_report(mission, dir_path)
        object_name = f'report-{mission.title}.pdf'
        s3.upload_file(bucket_name, file_path=filepath, file_name=object_name)
        rmtree(dir_path)

        print(s3.client.presigned_get_object(
            bucket_name=bucket_name,
            object_name=object_name,
        ))

        return HttpResponseRedirect(
            redirect_to=s3.client.presigned_get_object(
                bucket_name=bucket_name,
                object_name=object_name,
            ))

    def dump_report(self, mission: Mission, dir_path) -> str:
        path_cover_page = f'{dir_path}/coverpage.html'
        path_project_info = f'{dir_path}/projectinfo.html'

        os.mkdir(dir_path, dir_fd=None)
        with open(path_cover_page, 'w+') as fd:
            fd.write(self.generate_cover(mission, mission.team.leader))
        with open(path_project_info, 'w+') as fd:
            fd.write(self.generate_project_info(mission, mission.team))

        path_to_file = f'{dir_path}/report.pdf'

        pages = [
            path_project_info
        ]
        toc = {
            "toc-header-text": "Table of Contents",
        }

        # TODO: css stylesheet
        pdfkit.from_file(pages,
                         options={
                             "enable-local-file-access": True,
                         },
                         output_path=path_to_file,
                         toc=toc,
                         cover=path_cover_page,
                         cover_first=True, )
        return path_to_file

    def generate_cover(self, mission: Mission, leader: Manager):
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
        <img alt="logo-company"
            src="#{logo_path_2}" />
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

    def generate_condition_and_scope(self, scope):

