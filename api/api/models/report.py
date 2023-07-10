import re

import markdown
from django.db import models


class ReportTemplate(models.Model):
    pass


class ReportMarkdownForm(models.Model):
    """
        When the PDF template is selected, the user can then write markdown for its final report.
    """

    class Meta:
        verbose_name = 'Report Markdown Form'
        verbose_name_plural = 'Report Markdown Forms'

    REQUIRED_FIELDS = []
    template_id = models.ForeignKey(to=ReportTemplate, on_delete=models.CASCADE, related_name='template_id')
    markdown_content = models.TextField()  # TODO: Add a default with the template id

    def find_between_tag(self, tag, content):
        return re.findall("<" + tag + ">(.*?)</" + tag + ">", content)[0]

    def to_html(self) -> str:
        html_opt: str = ''
        pages = []
        current_page_info = {}

        self.markdown_content = self.markdown_content.replace('\n\n', '<div style="height: 40px; width: 100%;" />')
        for page in self.markdown_content.split('_ _ _'):
            html_page = markdown.markdown(page)
            html_page = html_page.replace('h2', 'h6')
            current_page_info['title'] = self.find_between_tag('h1', html_page)
            for i in range(len(html_page)):
                if html_page[i: i + 3] == '<h1>':
                    if self.find_between_tag('h1', html_page[i]) != current_page_info['title']:  # there are 2 <h1>
                        html_page[i:] = html_page[i:].replace('h1', 'h6')

                if html_page[i: i + 4] == '</h3>' or html_page[i: i + 4] == '</h6>':
                    i += 4
                    html_page = f'{html_page[:i]}<div class="section-text">{html_page[i:]}'
                    while html_page[i] and (html_page[i: i + 3] != '<h3>' or html_page[i: i + 3] != '<h6>'):
                        i += 1
                    if html_page[i]:
                        i += 3
                    html_page = f'{html_page[:i]}</div>{html_page[i:]}'
            # TODO: faire le header et le tag main.

        html_opt = markdown.markdown(self.markdown_content)
        html_opt.replace('h2', 'h6')
        html_opt.replace('_ _ _', '<div style = "display:block; clear:both; page-break-after:always;" />')
        return html_opt
