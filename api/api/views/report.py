import os
from datetime import datetime
from typing import Type, List
import pdfkit
from django.http import HttpResponseRedirect

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework.views import APIView

from api.models import Team, Manager
from api.models.mission import Mission
from api.services.s3 import S3Bucket


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
        bucket_name = f'mission_{mission_id}'
        s3.create_bucket(bucket_name)
        filepath = self.dump_report(mission)
        object_name = filepath.replace("/tmp/", "")
        s3.upload_file(bucket_name, file_path=filepath, file_name=object_name)
        self.remove_report_from_tmp(filepath)
        return HttpResponseRedirect(
            redirect_to=s3.client.presigned_get_object(
                bucket_name=bucket_name,
                object_name=object_name,
            ))

    def remove_report_from_tmp(self, filepath: str):
        assert filepath.startswith("/tmp/")
        assert "/../" not in filepath
        os.remove(filepath)

    def dump_report(self, mission: Mission) -> str:
        path_to_file = f"/tmp/mission_{mission.pk}/{datetime.utcnow().timestamp()}.pdf"
        pages = [
            self.generate_project_info(mission, mission.team)
        ]
        toc = {
            "toc-header-text": "Table of Contents",
        }

        # TODO: css stylesheet
        pdfkit.from_string(pages,
                           output_path=path_to_file,
                           toc=toc,
                           cover=self.generate_cover(mission, mission.team.leader),
                           cover_first=True)
        return path_to_file

    def generate_cover(self, mission: Mission, leader: Manager):
        return '''
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penetration Test Report: {mission_title}</title>
</head>
<body>
    <div class="cover-page">
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
                   leader_leader_phone_number=leader.auth.phone_number,
                   leader_email=leader.auth.email)

    def generate_project_info(self, mission: Mission, team: Team) -> str:
        return '''
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Information</title>
</head>

<body>
    <header>
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
                    <p>Mario Korth (Hackmanit GmbH)</p>
                    <p>Mario Korth (Hackmanit GmbH)</p>
                    <p>Mario Korth (Hackmanit GmbH)</p>
                    <p>Mario Korth (Hackmanit GmbH)</p>
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
                   members=self.generate_members(team),
                   mission_start=mission.start,
                   mission_end=mission.end)

    def generate_members(self, team: Team):
        members_html = ""
        for member in team.members:
            members_html += f"<p>{member.auth.first_name} {member.auth.last_name}</p>"
        return members_html
