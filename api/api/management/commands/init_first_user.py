"""Initiates first user on bare deployments"""
from django.core.management.base import BaseCommand

from api.models import Manager, Auth


class Command(BaseCommand):
    """Command creating the first user (admin) if database does not have any."""
    def handle(self, *_, **__):
        if Manager.objects.count() == 0:
            auth = Auth(
                    role=2,
                    email='admin@voron.sh',
                    phone_number="0600000000",
                    is_superuser=True,
                    username='admin',
                    first_name='admin',
                    last_name='user',
                    is_active=True,
                    password='!ChangeMe!',
                    is_enabled=True,
                )
            auth.set_password(auth.password)
            auth.save()

            manager = Manager(auth=auth)
            manager.save()

            print(f'[+] Manager user {manager} has been created.')

        else:
            print('[!] Manager user has already been created.')
