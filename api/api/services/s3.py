"""module handling minio integration"""

import base64
from io import BytesIO
import os
import re
from typing import Dict, Optional
import uuid

from minio import Minio

class S3Bucket:
    def __init__(self) -> None:
        # containers can be ran locally and dont need ssl
        self.client = Minio(
            os.environ["MINIO_HOST"],
            os.environ['MINIO_ROOT_USER'],
            os.environ['MINIO_ROOT_PASSWORD'],
            secure=os.environ.get('PRODUCTION', '0') == '1',
        )

    def __get_mime_type(self, content: str) -> Optional[str]:
        """Get MIME type from the start of an image file"""

        pattern = re.compile('data:(.*);base64')
        if pattern.match(content):
            rg_search = pattern.search(content)
            if not rg_search:
                return None

            content_type = rg_search.group(0)
            if not content_type.startswith('data:image/'):
                return None

            image_type = content_type.split('/')[1].split(';', 1)[0]
            allowed_filetype = ['jpg', 'jpeg', 'png', 'gif']

            if image_type not in allowed_filetype:
                return None
            return image_type
        return None


    def __get_image_data(self, content: str) -> Optional[bytes]:
        """Strips the MIME type information from image data"""
        as_base64 = content.split('base64,')
        if len(as_base64) != 2:
            return None

        as_base64 = as_base64[1]
        from_base64 = base64.b64decode(as_base64)
        return from_base64


    def upload_single_image(self, image_data: str) -> Optional[str]:
        mime = self.__get_mime_type(image_data)
        as_b64 = self.__get_image_data(image_data)

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
