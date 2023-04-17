"""module handling minio integration"""

import os

import minio

def client() -> minio.Minio:
    """load minio client"""

    return Minio(
        "s3:9000",
        access_key = os.getenv("MINIO_ACCESS_KEY"),
        secret_access_key = os.getenv("MINIO_SECRET_KEY"),
    )


def get_bucket(bucket: str) -> None:
    """creates S3 bucket if it does not exist"""

    client = client()
    if not client.bucket_exists(bucket):
        client.make_bucket(bucket)
