
from django.core.management.base import BaseCommand

from api.models.vulns import VulnType


class Command(BaseCommand):
    """Command creating the first user (admin) if database does not have any."""
    def handle(self, *_, **__):
        if VulnType.objects.count() == 0:

            VulnType(name="DoS").save()
            VulnType(name="Code execution").save()
            VulnType(name="Overflow").save()
            VulnType(name="Memory Corruption").save()
            VulnType(name="SQL Injection").save()
            VulnType(name="XSS").save()
            VulnType(name="Directory Traversal").save()
            VulnType(name="Http Response Splitting").save()
            VulnType(name="Bypass Something").save()
            VulnType(name="Gain Information").save()
            VulnType(name="Gain Privileges").save()
            VulnType(name="CSRF").save()
            VulnType(name="File Inclusion").save()

            print(f'[+] All vulnerability type created.')

        else:
            print(VulnType.objects.all())
            print('[!] Vulnerabilities builtins has already been created.')
