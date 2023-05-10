"""module handling minio integration"""

from io import BytesIO
import os

from minio import Minio
from minio.api import VersioningConfig
from minio.versioningconfig import ENABLED

MINIO_URL = f'{os.environ["MINIO_HOST"]}:9000'


class S3Bucket:
    def __init__(self) -> None:
        self.client = Minio(
            MINIO_URL,
            os.environ['MINIO_ROOT_USER'],
            os.environ['MINIO_ROOT_PASSWORD'],
            secure=False
        )

    def create_bucket(self, bucket: str) -> None:
        if not self.client.bucket_exists(bucket):
            self.client.make_bucket(bucket)

    def get_object(self, bucket: str, object_name: str) -> bytes:
        return self.client.get_object(bucket, object_name)

    def upload_stream(
            self,
            bucket: str,
            object_name: str,
            iostream: BytesIO,
            mime_type: str
    ) -> None:
        self.client.put_object(
            bucket,
            object_name,
            iostream,
            iostream.getbuffer().nbytes,
            content_type=mime_type,
        )

    def get_object_url(self, bucket: str, object_name: str) -> str:
        presigned_url = self.client.presigned_get_object(bucket, object_name)
        if os.environ.get('PRODUCTION', '0') == '1':
            return presigned_url.replace(f'{MINIO_URL}', f'{os.environ["DOMAIN_NAME"]}/buckets')
        return presigned_url

    def upload_file(self, bucket: str, file_path: str, file_name: str) -> None:
        self.client.fput_object(bucket, file_name, file_path)

    def download_file(self, bucket: str, file_name: str, file_path: str) -> None:
        self.client.fget_object(bucket, file_name, file_path)

    def delete_file(self, bucket: str, file_name: str) -> None:
        self.client.remove_object(bucket, file_name)

    def delete_bucket(self, bucket: str) -> None:
        self.client.remove_bucket(bucket)
