"""module handling minio integration"""

import os

from minio import Minio
from minio.api import VersioningConfig
from minio.versioningconfig import ENABLED


class S3Bucket:
    def __init__(self) -> None:
        self.client = Minio(
            "s3:9000",
            os.getenv("MINIO_ROOT_USER"),
            os.getenv("MINIO_ROOT_PASSWORD"),
            secure=False
        )

    def create_bucket(self, bucket: str) -> None:
        if not self.client.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    def get_object(self, bucket: str, object_name: str) -> bytes:
        return self.client.get_object(bucket, object_name)

    def upload_file(self, bucket: str, file_path: str, file_name: str) -> None:
        # what is the difference between these two?
        # self.client.presigned_put_object(bucket, file_name)
        self.client.fput_object(bucket, file_name, file_path)

    def download_file(self, bucket: str, file_name: str, file_path: str) -> None:
        self.client.fget_object(bucket, file_name, file_path)

    def delete_file(self, bucket: str, file_name: str) -> None:
        self.client.remove_object(bucket, file_name)

    def delete_bucket(self, bucket: str) -> None:
        self.client.remove_bucket(bucket)
