import os

from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket
from api.models import Team


def generate_members(team: Team) -> str:
    """generate members page"""

    members_html = ""
    for member in team.members.all():
        members_html += f"<p>{member.auth.first_name} {member.auth.last_name}</p>"
    return members_html

def generate_vulns_detail(mission: Mission) -> str:
    html = ""
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
        vuln_label_class = f'{severity_key}-wkns'
        vuln_label = severity_key.upper() + f'0{severity_counter[severity_key]}' \
            if severity_counter[severity_key] < 10 else severity_counter[severity_key]

        html += '''
    <table class="main-table">
        <thead>
            <tr>
                <th>Exploitability Metrics</th>
                <th>Impact Metrics</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <table class="sub-table">
                        <tr>
                            <td>Attack Vector (AV)</td>
                            <th>Network</th>
                        </tr>
                        <tr>
                            <td>Attack Complexity (AC)</td>
                            <th>Low</th>
                        </tr>
                        <tr>
                            <td>Privileges Required (PR)</td>
                            <th>Low</th>
                        </tr>
                        <tr>
                            <td>User Interaction</td>
                            <th>Required</th>
                        </tr>
                    </table>
                </td>
                <td>
                    <table class="sub-table">
                        <tr>
                            <td>Confidentiality Impact (C)</td>
                            <th>Low</th>
                        </tr>
                        <tr>
                            <td>Integrity Impact (I)</td>
                            <th>Low</th>
                        </tr>
                        <tr>
                            <td>Availability Impact (A)</td>
                            <th>None</th>
                        </tr>
                        <tr>
                            <td>Scope (S)</td>
                            <th>Unchanged</th>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>Subscore: <span>{subscore_1}</span></td>
                <td>Subscore: <span>{subscore_2}</span></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Overall CVSS Score for <span class="{vuln_label_class}">{vuln_label}</span></th>
                <td><span>{cvss_score}</span></th>
                </td>
            </tr>
        </tfoot>
    </table>
    <section>
        <p><span>General Description.</span>{vuln_type_description}
        </p>
        <p><span>Weaknessess.</span>{vuln_description}</p>
    </section>
    {images}
        '''.format(vuln_label_class=vuln_label_class,
                   vuln_label=vuln_label,
                   vuln_title=vuln.title,
                   subscore_1=vuln.severity * 0.45,  # BS hihi chuuuut
                   subscore_2=vuln.severity * 0.55,
                   cvss_score=vuln.severity,
                   vuln_type_description=vuln.vuln_type.description,
                   vuln_description=vuln.description,
                   images=generate_vuln_figures(vuln))
    return html


def generate_vuln_figures(vuln: Vulnerability, md=False) -> str:
    figure_html = ""
    figure_md = ""
    s3_client = S3Bucket()
    for i, image in enumerate(vuln.images):
        if os.environ.get('CI', '0') == '1' or os.environ.get('TEST', '0') == '1':
            continue

        if md:
            figure_md += f'''
                ![Figure {i + 1}]({s3_client.get_object_url('rootbucket', image)})
                _Figure {i + 1}_
            '''
        else:
            figure_html += '''
    <div class="figure">
        <img src="{img_path}"/>
        <p>{description}</p>
    </div>
        '''.format(img_path=s3_client.get_object_url('rootbucket', image),
                   description=f"Figure {i + 1}")  # well, Figure 0 is a bit weird..
    return figure_html
