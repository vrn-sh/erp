import os
from django.core.management.base import BaseCommand

from api.models import Manager, Auth, TwoFactorAuth


class Command(BaseCommand):
    def handle(self, *args, **options):
        if Manager.objects.count() == 0:
            two_fa = TwoFactorAuth(method=1)
            two_fa.save()

            auth = Auth(
                    role=2,
                    email='sheev.palpatine@naboo.net',
                    is_superuser=True,
                    username='the_emperor',
                    first_name='sheev',
                    last_name='palpatine',
                    is_active=True,
                    password='sidious1337',
                    two_factor=two_fa
                )
            auth.save()

            manager = Manager(auth=auth)
            manager.save()

            print(f'[+] Manager user {manager} has been created.')

        else:
            print('[!] Manager user has already been created.')
