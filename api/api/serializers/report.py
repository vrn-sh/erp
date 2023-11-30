from datetime import date
import os
from rest_framework import serializers
from django.core.cache import cache
from weasyprint import CSS, HTML
from weasyprint.text.fonts import FontConfiguration
from api.models.mission import Mission
from api.models import Team
from api.models.report.generate_html import generate_members, generate_vulns_detail
from api.models.report.report import ReportHtml, ReportTemplate
from api.services.s3 import S3Bucket

class ReportHtmlSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReportHtml
        fields = '__all__'

    def to_representation(self, instance):
        cache_key = f'report_{instance.pk}'
        if cached := cache.get(cache_key):
            return cached

        representation = super().to_representation(instance)
        s3_client = S3Bucket()

        representation['logo'] = ''

        if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
            return representation

        s3_client = S3Bucket()
        if instance.logo:
            representation['logo'] = s3_client.get_object_url("rootbucket", instance.logo)
        filename = f'report-{instance.pk}-{instance.version}.pdf'
        filepath = f'/tmp/{filename}'
        html_content = self.dump_academic_report(instance, representation['logo']) \
            if instance.template.name == "academic" \
                        else self.dump_html_report(instance, representation['logo'])
        HTML(string=html_content).write_pdf(
            filepath,
            stylesheets=[CSS(string=instance.template.css_style)],
            font_config=FontConfiguration())
            
        s3_client.upload_file('rootbucket', filepath, filename)
        representation['pdf_file'] = s3_client.get_object_url('rootbucket', filename)
        print(representation['pdf_file'])
        os.remove(filepath)
        cache.set(cache_key, representation)
        return representation

    def dump_academic_report(self, instance, logo=None) -> str:

        def generate_members(mission: Mission) -> str:
            team: Team = mission.team
            members_html = f'<span>{team.leader.auth.first_name} {team.leader.auth.last_name}</span>'
            for member in team.members.all():
                members_html += f'<span>{member.auth.first_name} {member.auth.last_name}</span>'
            return members_html

        def generate_scope(mission: Mission) -> str:
            scope = ''
            for x in mission.scope:
                scope += f"<li><code>{x}</code></li>" if "*" in x or "$" in x else f"<li>{x}</li>"

            return '<h2>General conditions and Scope</h2><ul>{content}</ul>'.format(
                content=scope
            )

        def generate_weaknesses(mission: Mission) -> str:
            return '''
            <h2>Weaknesses</h2>
             <p>In the following sections, we list the identified weaknesses. Every weakness has an identification name
                    which can be used as a reference in the event of questions, or during the
                    patching phase.</p>
            {vuln_details}
            '''.format(vuln_details=generate_vulns_detail(mission))


        return \
        '''
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{mission_title}</title>
            </head>

                <body>

                <header>
                    <img src={logo} />
                    <h1>{mission_title}</h1>
                    <div class="authors">
                        {members}
                    </div>
                    <div class="lab">{team_name}</div>
                </header>

                <main>
                        {scope}
                        {weaknesses}
                </main>
                </body>
            </html>
        '''.format(logo=logo,
                   mission_title=instance.mission.title,
                   members=generate_members(instance.mission),
                   team_name=instance.mission.team.name,
                   scope=generate_scope(instance.mission),
                   weaknesses=generate_weaknesses(instance.mission),
            )

    def dump_html_report(self, instance, logo_url) -> str:
        """compile pages together to generate a report"""
        print("logo url", logo_url)
        return \
        '''
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>

                <body style="margin: 0; padding:0;">
                    {cover_page}
                    <div style="page-break-after: always;"></div>
                    <section style="margin: 40px;">
                        {members}
                    </section>
                    <div style="page-break-after: always;"></div>
                    <section style="margin: 40px;">
                        {scope}
                    </section>
                    <div style="page-break-after: always;"></div>
                    <section style="margin: 40px;">
                        {weaknesses}
                    </section>
                </body>
            </html>
        '''.format(
                   cover_page=self.generate_cover(instance, logo=logo_url),
                   members = self.generate_project_info(instance, logo=logo_url),
                   scope=self.generate_condition_and_scope(instance, logo=logo_url),
                   weaknesses=self.generate_weaknesses(instance, logo=logo_url),)


    def generate_cover(self, instance, logo: str = ""):
        if instance.template.name == "academic":
            raise Exception("Academic posses its own class to generate Cover page.")
        if instance.template:
            cover_html = instance.template.cover_html.format(
                mission_title=instance.mission.title,
                report_version=instance.version,
                report_date=date.today().strftime('%Y-%m-%d'),
                team_name=instance.mission.team.name,
                logo=logo or instance.logo
            )
            return '''
            <div>
            {cover}
            </div>
            '''.format(cover=cover_html)

    def gen_header(self, instance, title: str, logo:str = "") -> str:

        if instance.template.name == "academic":
            raise Exception("Academic posses its own class to generate header.")
        header_templates = [
            {
                "name": "hackmanit",
                "html_header": '''
                      <header>
          <style>
              header {
                  display: block;
              }

              img {
                  float: right;
                  height: 70px;
                  object-fit: contain;
              }

              .inline-title-logo {
                  display: flex;
                  justify-content: space-between;
              }

              .inline-title-logo p {
                  font-variant: small-caps;
                  color: red;
                  font-weight: 400;
                  letter-spacing: 1.5px;
                  margin: 0;
              }
          </style>
          ''' + f'''
          <div class="inline-title-logo">
              <img alt="logo-company" id="logo"
                  src="{logo}" />
              <p>{title}</p>
          </div>
          <div class="divider-x"></div>
      </header>
                  '''
            },
        {
            "name": "NASA",
            "html_header": '''    <header>
        <style>
            header .info {
                background-color: #bebebe;
                width: 80%;
                padding: 0px 15px 0 15px;
            }

            header h1 {
                font-variant: small-caps;
                font-size: 3em;
                margin: 15px 0;
            }

            header .identity {
                display: flex;
                justify-content: space-between;

            }

            header .identity img {
                object-fit: contain;
                height: 70px;
            }

            header .identity .info .company-info p:first-child {
                font-size: 1.65em;
            }

            header .identity .info .company-info p {
                font-size: 1.5em;
                margin: 15px 0px;
            }

            .info .report-info {
                display: flex;
                justify-content: space-between;
                font-size: 1em;
            }
        </style>''' + f'''
        <div class="identity">
            <img class="logo"
                src="{logo}"
                alt="logo" />
            <div class="spacer-x"></div>
            <div class="info">
                <h1><span>{title[0]}</span>{title[1:]}</h1>
            </div>
        </div>
    </header>'''
            
        },
        {
            "name": "yellow",
            "html_header": '''
<header>
        <style>
            header {
                display: block;
            }

            img {
                float: right;
                height: 10%;
                width: 15%;
                object-fit: cover;
            }
            .heading-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #heading-title {
                font-size: 13px;
                padding: 1.5em;
                background-color: #fbc847;
            }
        </style>''' + '''
        <div class="heading-info">
            <div id="heading-title">{title}</div>
            <img alt="logo-company" id="logo"
                src="{logo}" />
        </div>
        <div class="divider-x"></div>
</header>
            '''
        }
        ]
        return list(filter(lambda a: a['name'] == instance.template.name, header_templates))[0]['html_header']

    def generate_project_info(self, instance, logo: str = ""):

        if instance.template.name == "academic":
            raise Exception("Academic posses its own class to generate Project Info")
        team: Team = instance.mission.team
        return '''
        <div>

            {header}
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

        </div>
                '''.format(header=self.gen_header(instance, 'Project Information', logo=logo),
                           leader_first_name=team.leader.auth.first_name,
                           leader_last_name=team.leader.auth.last_name,
                           leader_phone_number=team.leader.auth.phone_number,
                           leader_email=team.leader.auth.email,
                           members=generate_members(team),
                           mission_start=instance.mission.start,
                           mission_end=instance.mission.end,
                           logo_path_2="",)

    def generate_condition_and_scope(self, instance, logo: str="") -> str:

            if instance.template.name == "academic":
                raise Exception("Academic posses its own class to generate Scope.")
            scope_html = ""
            for s in instance.mission.scope:
                scope_html += f"<li><code>{s}</code></li>" if "*" in s or "$" in s else f"<li>{s}</li>"

            return '''
    <div>
        {header}
        <main class="scopes" style="margin:40px;">
            <h1>General Condition and Scope</h1>
            <div class="section-text">
                <p>The scope allowed was the following:</p>
                <ul>{scopes}</ul>
            </div>
        </main>
    </div>
            '''.format(scopes=scope_html,
                       header=self.gen_header(instance, 'General Scope and Conditions', logo=logo),)

    def generate_weaknesses(self, instance, logo: str = "") -> str:
        return '''
    <div>
    {header}
        <main>
            <h1>Weaknesses</h1>
            <div class="section-text">
                <p>In the following sections, we list the identified weaknesses. Every weakness has an identification name
                    which can be used as a reference in the event of questions, or during the
                    patching phase.</p>
            </div>
            {vulnerabilities}
        </main>
    </div>
            '''.format(vulnerabilities=generate_vulns_detail(instance.mission),
                       css_style=instance.template.css_style,
                       header=self.gen_header(instance, 'Weaknesses', logo=logo))
