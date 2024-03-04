from django.core.management.base import BaseCommand
from minio import Minio
import os
import logging

logger = logging.getLogger(__name__)


class S3Bucket:
    def __init__(self):
        # For testing: Hardcoded endpoint. Replace 'minio:9000' with your actual MinIO host and port.
        endpoint = 'minio:9000'

        # Logging the endpoint to debug
        logger.debug(f"Using MinIO endpoint: {endpoint}")

        self.client = Minio(
            endpoint,
            access_key=os.environ['MINIO_ROOT_USER'],
            secret_key=os.environ['MINIO_ROOT_PASSWORD'],
            secure=False  # Set to True if your MinIO server is over HTTPS
        )

    def create_bucket(self, bucket_name):
        # Bucket creation logic here
        pass


class Command(BaseCommand):
    help = "Creates rootbucket if it does not exist"

    def handle(self, *args, **kwargs):
        logger.info("[+] Checking rootbucket status")
        bucket = S3Bucket()
        bucket.create_bucket('rootbucket')
