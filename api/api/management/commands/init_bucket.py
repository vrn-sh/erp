"""Initiates root bucket if not created"""
from django.core.management.base import BaseCommand

from api.services.s3 import S3Bucket

class Command(BaseCommand):
    """creates rootbucket if it does not exist"""

    def handle(self, *args, **kwargs):
        print("[+] checking rootbucket status")
        S3Bucket().create_bucket('rootbucket')
