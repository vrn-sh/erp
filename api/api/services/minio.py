"""module handling minio integration"""

import os

import minio

def client() -> minio.Minio:
    """load minio client"""

    return minio.Minio(
        "s3:9000",
        access_key = os.getenv("MINIO_ROOT_USER"),
        secret_access_key = os.getenv("MINIO_ROOT_PASSWORD"),
    )


def get_bucket(bucket: str) -> None:
    """creates S3 bucket if it does not exist"""

    s3 = client()
    if not s3.bucket_exists(bucket):
        s3.make_bucket(bucket)
