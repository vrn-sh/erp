from datetime import date

from django.db import models

from api.models.mission import Mission


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
                report_date=date.today().strftime('%Y-%m-%d')
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
            }
        ]
        return list(filter(lambda a: a['template_id'] == self.template, header_templates))[0]['html_header']
