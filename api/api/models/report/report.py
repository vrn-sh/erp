from datetime import date

from django.db import models

from api.models.mission import Mission

from api.models import Team
from api.models.report.generate_html import generate_vulns_detail, generate_members


class ReportTemplate(models.Model):
    class Meta:
        verbose_name = 'Report Template'
        verbose_name_plural = 'Report Templates'

    REQUIRED_FIELDS = []
    name = models.CharField(max_length=25)
    css_style = models.TextField()
    cover_html = models.TextField()


class ReportHtml(models.Model):
    class Meta:
        verbose_name = 'Report Html'
        verbose_name_plural = 'Reports Html'

    REQUIRED_FIELDS = []

    template = models.ForeignKey(to=ReportTemplate, on_delete=models.CASCADE, related_name='template_id',
                                 blank=True, default=None)
    mission = models.ForeignKey(to=Mission, on_delete=models.CASCADE, related_name='mission_id')
    version = models.FloatField(default=1.0)

    def generate_cover(self):
        if self.template:
            return self.template.cover_html.format(
                mission_title=self.mission.title,
                report_version=self.version,
                report_date=date.today().strftime('%Y-%m-%d'),
                team_name=self.mission.team.name
            )

    def gen_header(self, title: str) -> str:
        header_templates = [
            {
                "name": "red4sec",
                "template_id": 1,
                "html_header": '''
                          <header>
          <style>
              header {
                  display: block;
              }

              .inline-title-logo {
                  display: flex;
                  justify-content: space-between;
                  background-color:  rgb(77, 76, 76);
              }

              .inline-title-logo .box {
                  width: 15%;
                  float: right;
                  background-color: rgba(255, 86, 11, 1) !important;
              }

              .inline-title-logo p {

                  padding: 1.5rem;
                  font-variant: small-caps;
                  font-weight: 400;
                  letter-spacing: 1.5px;
                  margin: 0;
              }

              .inline-title-logo p#logo {
                  float: right;
                  color: white;
                  font-weight: bold;
              }

              .inline-title-logo p#logo span {
                  color: rgba(255, 86, 11, 1) !important;
              }

              .client-name {
                  display: flex;
                  justify-content: space-between;
              }

              .client-name img {
                  object-fit: cover;
                  width: 15%;
              }
              .client-name p {
                  align-self: center;
                  font-size: xx-large;
                  color: gray;
                  font-weight: medium;
              }
          </style>
          <div class="inline-title-logo">
          ''' + f'''
              <p id="logo">RED<span>4</span>SEC</p>
              <div class="box"></div>
          </div>
          <div class="client-name">
              <p>{title}</p>
              <img src="https://avatars.githubusercontent.com/u/33096324?s=280&v=4">
          </div>
      </header>
                  '''
            },
            {
                "name": "hackmanit",
                "template_id": 2,
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
                  src="https://www.hackmanit.de/templates/hackmanit2021j4/img/wbm_hackmanit.png" />
              <p>{title}</p>
          </div>
          <div class="divider-x"></div>
      </header>
                  '''
            },
        {
            "name": "NASA",
            "template_id": 3,
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
                object-fit: cover;
                width: 50%;
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
        </style>
        <div class="identity">
            <img class="logo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAEN65TxlSnQM7q0XFcfdpqZkxhnIWs4BUqg&usqp=CAU"
                alt="logo" />
            <div class="spacer-x"></div>
            <div class="info">
                <h1><span>R</span>esults in <span>B</span>rief</h1>
                <div class="divider-x"></div>
                <div class="company-info">
                    <p>Office of Inspector General</p>
                    <p>Office of Audits</p>
                </div>
                <div class="report-info">
                    <p>June 18, 2019</p>
                    <p>IG-019-22</p>
                </div>
            </div>
        </div>
    </header>'''
            
        }
        ]
        return list(filter(lambda a: a['template_id'] == self.template, header_templates))[0]['html_header']

    def generate_project_info(self):
        team: Team = self.mission.team
        return '''
                <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Information</title>
        </head>
        <style>
        {css_style}
        </style>

        <body>

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

        </body>

        </html>
                '''.format(header=self.gen_header('Project Information'),
                           leader_first_name=team.leader.auth.first_name,
                           leader_last_name=team.leader.auth.last_name,
                           leader_phone_number=team.leader.auth.phone_number,
                           leader_email=team.leader.auth.email,
                           members=generate_members(team),
                           mission_start=self.mission.start,
                           mission_end=self.mission.end,
                           logo_path_2="",
                           css_style=self.template.css_style)

    def generate_condition_and_scope(self) -> str:
            scope_html = ""
            for s in self.mission.scope:
                scope_html += f"<li><code>{s}</code></li>" if "*" in s or "$" in s else f"<li>{s}</li>"

            return '''
            <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>General Conditions and Scope</title>
    </head>
    <style>
    {css_style}
    </style>
    <body>
        {header}
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
                       header=self.gen_header('General Scope and Conditions'),
                       css_style=self.template.css_style)

    def generate_weaknesses(self) -> str:
        return '''
            <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weaknesses</title>
    </head>
    
    <style>
    {css_style}
    </style>
    {header}
    <body>
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
            '''.format(vulnerabilities=generate_vulns_detail(self.mission),
                       css_style=self.template.css_style,
                       header=self.gen_header('Weaknesses'))