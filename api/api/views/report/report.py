# api/api/views/report/report.py

import base64
from io import BytesIO
import os
from typing import Type, List
from uuid import uuid4
from django.http import HttpResponseRedirect
from django.core.files.base import File
from shutil import rmtree

from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, JSONParser
from knox.auth import TokenAuthentication
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_400_BAD_REQUEST

from rest_framework.views import APIView
from rest_framework import viewsets
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
from api.pagination import CustomPagination
from api.serializers.report import ReportHtmlSerializer

from api.models.mission import Mission
from api.models.vulns import Vulnerability
from api.services.s3 import S3Bucket

from api.models.report.report import ReportTemplate, ReportHtml
from api.models.report.generate_html import generate_vuln_figures

DIR_STYLE = "./api/pdf-templates/hackmanit-template"
CSS_PATH = f'{DIR_STYLE}/main.css'
ABSOLUTE_DIR_STYLE = os.path.abspath(DIR_STYLE.replace("api/", ""))
ABSOLUTE_CSS_PATH = f"{ABSOLUTE_DIR_STYLE}/main.css"


def get_image_file_as_base64_data(path: str) -> bytes:
    """read an image and get its content as base64"""

    with open(path, 'rb') as image_file:
        return base64.b64encode(image_file.read())


class GeneratePDFReportView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes: List[Type[TokenAuthentication]] = [
        TokenAuthentication]
    serializer_class = ReportHtmlSerializer
    pagination_class = CustomPagination
    parser_classes = [MultiPartParser, JSONParser]
    # queryset = ReportHtml.objects.all().order_by('-updated_at')
    queryset = ReportHtml.objects.all()

    @swagger_auto_schema(
        operation_description="Get the mission report generated with the mission' data.",
        manual_parameters=[
            openapi.Parameter(
                "mission",
                "body",
                required=True,
                type=openapi.TYPE_INTEGER,
                description="id of the mission"
            ),
            openapi.Parameter(
                name="template_name",
                in_="body",
                type=openapi.TYPE_INTEGER,
                description="name of the template. We have: 'NASA', 'hackmanit', 'academic', 'red4sec'."
            ),
            openapi.Parameter(
                "logo",
                "body",
                required=False,
                type=openapi.TYPE_OBJECT,
                description="logo in base64"
            )
        ],
        responses={
            "302": openapi.Response(
                description="Redirection to the minio storage of the pdf file.",
            )
        },
        security=['Bearer'],
        tags=['Report'],
    )
    def create(self, request, *args, **kwargs):
        mission_id = request.data.get('mission')
        if not mission_id:
            return Response({'error': 'Mission ID is required.'}, status=HTTP_400_BAD_REQUEST)

        mission = Mission.objects.filter(pk=mission_id).first()
        if not mission:
            return Response({'error': f'No mission with id {mission_id} found.'}, status=HTTP_404_NOT_FOUND)

        template_name = request.data.get('template_name')
        if not template_name:
            return Response({'error': 'Template name is required.'}, status=HTTP_400_BAD_REQUEST)

        template = ReportTemplate.objects.filter(name=template_name).first()
        if not template:
            return Response({'error': f'No template found with name {template_name}.'}, status=HTTP_404_NOT_FOUND)

        logo = "LOGO_HERE"  # Hardcoded logo information

        request.data['mission'] = mission_id
        request.data['template'] = template.pk

        if logo:
            request.data['logo'] = logo

        return super().create(request, *args, **kwargs)
