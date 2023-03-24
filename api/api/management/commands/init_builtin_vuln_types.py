
from typing import List, Tuple
from django.core.management.base import BaseCommand

from api.models.vulns import VulnType


class Command(BaseCommand):
    """Command creating the first user (admin) if database does not have any."""
    def handle(self, *_, **__):
        if VulnType.objects.count() == 0:

            vulns: List[Tuple[str, str]] = [
                ("Injection", "Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter as part of a command or query."),
                ("Broken Authentication and Session Management", "Application functions related to authentication and session management are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens, or to exploit other implementation flaws to assume other users’ identities."),
                ("Cross-Site Scripting (XSS)", "XSS flaws occur whenever an application includes untrusted data in a new web page without proper validation or escaping, or updates an existing web page with user-supplied data using a browser API that can create JavaScript. XSS allows attackers to execute scripts in the victim’s browser, which can hijack user sessions, deface web sites, or redirect the user to malicious sites."),
                ("Broken Access Control", "Restrictions on what authenticated users are allowed to do are often not properly enforced. Attackers can exploit these flaws to access unauthorized functionality and/or data, such as access other users' accounts, view sensitive files, modify other users’ data, change access rights, etc."),
                ("Security Misconfiguration", "Security misconfiguration is the most commonly seen issue, and it can happen at any level of an application stack, from the platform, web server, application server, database, framework, and custom code."),
                ("Cryptographic Failures", "Poor use of cryptography and algorithm are responsible for a series of threats that are known as Cryptographic failures. It is important to use encrypted connections to application like SFTP, HTTPS, SSH, etc while carrying out any configuration or code changes."),
                ("Insecure Design", "To keep application free of security gaps, it is recommended that developers use safe design patterns and securely created threat modeling while designing. A secure application can be build using secured component library, tooling and methodology."),
                ("Vulnerable and Outdated Components", "If the components used in the development of a website or application is outdated or is vulnerable itself, it can compromise the whole application."),
                ("Identification and Authentication Failures", "Before accessing any protected site, the application must keep a check on user’s identity, authentication, and session management."),
                ("Software and Data Integrity Failures", "Code and infrastructure that does not protect against integrity violations can lead to Software and data integrity failures. It is therefore important to verify the installed packages on your system and make sure that the data is from a reliable source and has not been altered at any stage."),
                ("Security Logging and Monitoring", "Security logging and monitoring are vital to the maintenance of a secure infrastructure. Viewing the logs regularly can be helpful in acting fast in case any potentially dangerous activity is noticed."),
                ("Server-Side Request Forgery", "Server-Side Request Forgery (SSRF) occurs when a web application procures a distant resource without validating the URL supplied by the user. The attacker can send a crafted request to an unexpected destination, even if protected by a firewall or VPN."),
                ("Remote Code Execution", "A Remote Code Execution vulnerability is a type of software security flaw that allows an attacker to execute arbitrary code on a remote system without authentication or authorization."),
                ("Request Forgery", "A Request Forgery vulnerability is a type of software security flaw that allows an attacker to trick a user into unintentionally executing an unwanted action on a website or web application, without their knowledge or consent."),
                ("Cache Poisonning", "A Cache Poisoning vulnerability is a type of software security flaw that allows an attacker to insert malicious data into a cache, potentially causing the system to deliver malicious content to unsuspecting users."),
                ("Denial of Service", "A Denial of Service vulnerability is a type of software security flaw that allows an attacker to disrupt the normal functioning of a system or network, rendering it unusable for legitimate users."),
                ("CSRF", "A CSRF (Cross-Site Request Forgery) vulnerability is a type of software security flaw that allows an attacker to trick a user into unintentionally executing unwanted actions on a website or web application, by exploiting the user's existing authenticated session."),
                ("Directory Traversal", "A Directory Traversal vulnerability is a type of software security flaw that allows an attacker to access files and directories outside of the web server's root directory, potentially exposing sensitive information or executing malicious code."),
                ("File Inclusion", "A File Inclusion vulnerability is a type of software security flaw that allows an attacker to include or execute arbitrary files on a web server, potentially exposing sensitive information or executing malicious code."),
                ("HTTP Response Splitting", "A HTTP Response Splitting vulnerability is a type of software security flaw that allows an attacker to manipulate a web server's HTTP response, potentially allowing the attacker to inject malicious content or hijack the user's browser.")
            ]


            for (name, desc) in vulns:
                VulnType(name=name, description=desc).save()

            print(f'[+] All vulnerability type created.')

        else:
            print('[!] Vulnerabilities builtins has already been created.')
