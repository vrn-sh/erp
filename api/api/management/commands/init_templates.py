import os

from django.core.management import BaseCommand

from api.models.report.report import ReportTemplate


class Command(BaseCommand):
    """Command creating report templates information"""
    def handle(self, *_, **__):
            templates = [
                ('red4sec',
                 self.read_css('./api/pdf-templates/red4sec-template/main.css'),
                 '''<div class="cover-page">
<svg id="wave-top" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
   <defs>
       <linearGradient id="url(#sw-gradient-1)" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 172, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 179, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-1)" fill-opacity="0.7" d="M0,160L180,96L360,192L540,224L720,288L900,0L1080,128L1260,128L1440,192L1440,0L1260,0L1080,0L900,0L720,0L540,0L360,0L180,0L0,0Z"></path>
   <defs>
       <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 142, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 85, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-0)" fill-opacity="0.7" d="M0,192L180,192L360,32L540,96L720,64L900,96L1080,224L1260,160L1440,96L1440,0L1260,0L1080,0L900,0L720,0L540,0L360,0L180,0L0,0Z"></path>        </svg>
   <img alt="logo-company" id="logo" src="{logo}" />
<h1>{team_name}</h1>

<svg id="wave-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
   <defs>
       <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 142, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 85, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-0)" fill-opacity="1" d="M0,64L205.7,128L411.4,32L617.1,192L822.9,128L1028.6,160L1234.3,32L1440,288L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"></path>

   <defs>
       <linearGradient id="sw-gradient-1" x1="0" x2="0" y1="1" y2="0">
           <stop stop-color="rgba(243, 62, 172, 1)" offset="0%"></stop>
           <stop stop-color="rgba(255, 179, 11, 1)" offset="100%"></stop>
       </linearGradient>
   </defs>
   <path fill="url(#sw-gradient-1)" fill-opacity="0.7" d="M0,64L205.7,224L411.4,256L617.1,256L822.9,224L1028.6,224L1234.3,32L1440,256L1440,320L1234.3,320L1028.6,320L822.9,320L617.1,320L411.4,320L205.7,320L0,320Z"></path></svg>
<div class="bandeau">

   <h2 id="mission-title">{mission_title}</h2>
   <div class="report-info">
       <p id="version">Version: {report_version}</p>
       <p id="report-date">{report_date}</p>
   </div>
</div>

</div>'''),
                ('hackmanit',
                 self.read_css('./api/pdf-templates/hackmanit-template/main.css'),
                 '''
    <div class="cover-page">
        <img alt="logo-company" id="logo" src="{logo}" />
        <h1 id="mission-title>{mission_title}</h1>
        <div class="report-info">
            <p>{team_name}</p>
            <p id="version">Version: {report_version}</p>
            <p id="report-date">{report_date}</p>
        </div>
    </div>
                 '''),
                ('NASA',
                 self.read_css('./api/pdf-templates/NASA-template/main.css'),
                 '''
    <div class="cover-page">
        <header>
            <div class="identity">
                <img class="logo"
                    src="{logo}"
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