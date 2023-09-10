"""module handling minio integration"""

from io import BytesIO
import os
from typing import Dict, Optional
import uuid
from warnings import warn

from minio import Minio

from api.serializers.utils import get_image_data, get_mime_type

class S3Bucket:
    def __init__(self) -> None:
        # containers can be ran locally and dont need ssl
        self.client = Minio(
            os.environ["MINIO_HOST"],
            os.environ['MINIO_ROOT_USER'],
            os.environ['MINIO_ROOT_PASSWORD'],
            secure=os.environ.get('PRODUCTION', '0') == '1',
        )


    def upload_single_image(self, image_data: str) -> Optional[str]:
        mime = get_mime_type(image_data)
        as_b64 = get_image_data(image_data)

        if not mime or not as_b64:
            return None

        image_name = f'{uuid.uuid4().hex}'
        iostream = BytesIO(as_b64)  # type: ignore
        _ = self.upload_stream(
            'rootbucket',
            image_name,
            iostream,
            f'image/{mime}',
        )
        return image_name


    def upload_single_image_if_exists(
            self,
            key_name: str,
            data: Optional[Dict[str, str]],
        ) -> Optional[str]:

        image: Optional[str] = data.get(key_name) if data else None
        if image:
            if '1' in (os.environ.get('CI', '0'), os.environ.get('TEST', '0')):
                return None
            return self.upload_single_image(image)


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
    ):
        return self.client.put_object(
            bucket,
            object_name,
            iostream,
            iostream.getbuffer().nbytes,
            content_type=mime_type,
        )

    def get_object_url(self, bucket: str, object_name: str) -> str:
        """returns url for a file to expose to the front-end"""
        return self.client.presigned_get_object(bucket, object_name)

    def upload_file(self, bucket: str, file_path: str, file_name: str) -> None:
        self.client.fput_object(bucket, file_name, file_path)

    def download_file(self, bucket: str, file_name: str, file_path: str) -> None:
        self.client.fget_object(bucket, file_name, file_path)

    def delete_file(self, bucket: str, file_name: str) -> None:
        self.client.remove_object(bucket, file_name)

    def delete_bucket(self, bucket: str) -> None:
        self.client.remove_bucket(bucket)
