"""module handling minio integration"""

import os

from minio import Minio
from minio.api import VersioningConfig
from minio.versioningconfig import ENABLED


def client() -> Minio:
    """load minio client"""

    return Minio(
        "s3:9000",
        os.getenv("MINIO_ROOT_USER"),
        os.getenv("MINIO_ROOT_PASSWORD"),
    )


def create_bucket(bucket: str) -> None:
    """creates S3 bucket if it does not exist"""

    s3 = client()
    if not s3.bucket_exists(bucket):
        s3.make_bucket(bucket)
        s3.set_bucket_versioning(bucket, VersioningConfig(ENABLED))
