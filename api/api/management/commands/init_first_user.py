"""Initiates first user on bare deployments"""
from django.core.management.base import BaseCommand

from api.models import Admin, Auth


class Command(BaseCommand):
    """Command creating the first user (admin) if database does not have any."""
    def handle(self, *_, **__):
        if Admin.objects.count() == 0:
            auth = Auth(
                    role=2,
                    email='admin@voron.sh',
                    is_superuser=True,
                    username='admin',
                    first_name='admin',
                    last_name='user',
                    is_active=True,
                    password='!ChangeMe!',
                )
            auth.set_password(auth.password)
            auth.save()

            admin = Admin(auth=auth)
            admin.save()

            print(f'[+] Admin user {admin} has been created.')

        else:
            print('[!] Admin user has already been created.')
