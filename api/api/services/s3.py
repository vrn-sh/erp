"""module handling minio integration"""

import os
import datetime
from typing import Optional
from knox.models import AuthToken

from minio import Minio
from minio.api import VersioningConfig
from minio.versioningconfig import ENABLED

from django.contrib.auth import get_user_model

from api.models import AuthenticatedUser

User = get_user_model()


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


def generate_sts_token(
        user: AuthenticatedUser,
        resource: str,
        ) -> Optional[dict[str, str]]:
    """
        generates an sts token for a specific bucket if
        user is allowed to see this bucket
    """

    # set up Minio client with your endpoint and credentials
    minio_client = client()

    # get authentication token to build claim
    auth_token = AuthToken.objects.get(user=user.auth)

    response = minio_client.assume_role_with_web_identity(
        RoleArn=f"arn:aws:s3:::rootbucket/{resource}/*",
        RoleSessionName=user.auth.username,
        WebIdentityToken=auth_token,
        DurationSeconds=3600
    )

    if response.status_code > 210:
        return None

    return response.json()
