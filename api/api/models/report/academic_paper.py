import os

import pdfkit

from api.models import Team
from api.models.mission import Mission
from api.models.report.generate_html import generate_vulns_detail
from rest_framework.response import Response
from api.models.report.report import ReportTemplate


class AcademicTemplate:
    
    def dump_report(self,  mission: Mission, dir_path: str, download: bool=True) -> str:
        template = \
        '''
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{mission_title}</title>
</head>

<style>
{css_style}
</style>

<body>

<header>
    <h1>{mission_title}</h1>
    <div class="authors">
        {members}
    </div>
    <div class="lab">{team_name}</div>
</header>

<main>
<section>
    {scope}
</section>
<section>
    {weaknesses}
</section>
</main>

</body>
</html>
        '''.format(mission_title=mission.title,
                   members=self.generate_members(mission),
                   team_name=mission.team.name,
                   scope=self.generate_scope(mission),
                   weaknesses=self.generate_weaknesses(mission),
                   css_style=ReportTemplate.objects.get(name='academic').css_style)
        
        if not download:
            return Response(template, status=status.HTTP_200_OK)

        os.mkdir(dir_path, dir_fd=None)
        path_to_file = f'{dir_path}/report.pdf'
        pdfkit.from_string(template,
                options={
                    "enable-local-file-access": None,
                },
                output_path=path_to_file,
        )

        return path_to_file

    def generate_members(self, mission: Mission) -> str:
        team: Team = mission.team
        members_html = f'<span>{team.leader.auth.first_name} {team.leader.auth.last_name}</span>'
        for member in team.members.all():
            members_html += f'<span>{member.auth.first_name} {member.auth.last_name}</span>'
        return members_html

    def generate_scope(self, mission: Mission) -> str:
        scope = ''
        for x in mission.scope:
            scope += f"<li><code>{x}</code></li>" if "*" in x or "$" in x else f"<li>{x}</li>"

        return '<h2>General conditions and Scope</h2><ul>{content}</ul>'.format(
            content=scope
        )

    def generate_weaknesses(self, mission: Mission) -> str:
        return '''
        <h2>Weaknesses</h2>
        <p>In the following sections, we list the identified weaknesses. Every weakness has an identification name
                which can be used as a reference in the event of questions, or during the
                patching phase.</p>
        {vuln_details}
        '''.format(vuln_details=generate_vulns_detail(mission))