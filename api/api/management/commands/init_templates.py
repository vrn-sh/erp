import os

from django.core.management import BaseCommand

from api.models.report.report import ReportTemplate


class Command(BaseCommand):
    """Command creating report templates information"""
    def handle(self, *_, **__):
            templates = [
                ('hackmanit',
                 self.read_css('./api/pdf-templates/hackmanit-template/main.css'),
                 '''
<div>
    <header>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{mission_title}</title>
    </header>
    <div class="cover-page">
        <img alt="logo-company" id="logo" src="{logo}" style="max-height: 300px;"/>
        <h1 id="mission-title>{mission_title}</h1>
        <div class="report-info">
            <p>{team_name}</p>
            <p id="version">Version: {report_version}</p>
            <p id="report-date">{report_date}</p>
        </div>
    </div>
</div>
                 '''),
                 (
                      'yellow',
                        self.read_css('./api/pdf-templates/yellow-template/main.css'),
                        '''
    <article id="cover">
      <h1 class="title">{mission_title}</h1>
      <address>
        <img alt="logo-company" id="logo" src="{logo}" style="max-height: 300px;"/>
      {team_name}
      </address>
      <address>
        <strong>Version:</strong> {report_version}<br>
        <strong>Date:</strong> {report_date}<br>
      </address>
    </article>
                        '''
                 ),
                ('NASA',
                 self.read_css('./api/pdf-templates/NASA-template/main.css'),
                 '''
    <div class="cover-page">
        <header>
            <div class="identity">
                <img class="logo"
                    src="{logo}"
                    style="max-height: 300px;"
                    alt="logo" />
                <div class="info">
                    <p>{team_name}</p>
                </div>
            </div>
        </header>
        <div class="title">
            <div class="divider-x"></div>
            <h1>{mission_title}</h1>
            <h2>{report_date}</h2>
            <div class="divider-x"></div>
        </div>
        <footer id="footer">
            <p>Report No. {report_version}</p>
        </footer>
    </div>
                 '''),

                (
                    'academic',
                    self.read_css('./api/pdf-templates/academic-template/main.css'),
                    '' # No coverpage for academic paper bc this one is particular and much more simple than the others.
                )
            ]
            for (name, css, cover_html) in templates:
                ReportTemplate(name=name, css_style=css, cover_html=cover_html).save()
                print('[+] All report templates created.')


    def read_css(self, css_relative_path) -> str:
        absolute_path = os.path.abspath(css_relative_path.replace("api/", ""))
        with open(absolute_path, 'r') as fd:
            return fd.read()