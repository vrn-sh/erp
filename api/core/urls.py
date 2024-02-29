"""Module responsible for storing API routes & OpenAPI config"""

from rest_framework import routers
from rest_framework import permissions
from rest_framework.urls import path
from django.urls import re_path
from django.urls import path

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from knox.views import LogoutView

from api.views import LoginView, PingView, ConfirmAccountView, ResetPasswordView
from api.views.hunter import HunterView, SaasProxyView, WappProxyView
from api.views.search import SearchView
from api.views.mfa import MFAView
from api.views.report.report import GeneratePDFReportView
from api.views.viewsets import FreelancerViewset, RegisterViewset, PentesterViewset, ManagerViewset, TeamViewset
from api.views.viewsets.vulns import NotesViewset, VulnerabilityViewset, VulnTypeViewset
from api.views.viewsets.mission import CredentialViewset, MissionViewset, NmapViewset, CrtShView, WappalyzerRequestView
from api.views.viewsets.client_info import ClientInfoViewset
from api.views.viewsets.mailing_list import MailingListViewset
from api.views.viewsets.survey import SurveyResponseViewset
from api.views.viewsets.send_message import SendMessageViewSet

# SchemaView provides view for OpenAPI specifications (using Redoc template)
SchemaView = get_schema_view(
    openapi.Info(
        title="voron API",
        default_version='0.2.0',
        description="API storing and managing notes, users, and stuff",
        terms_of_service="https://github.com/vrn-sh/erp/blob/current/LICENSE",
        contact=openapi.Contact(email="voron@djnn.sh"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = routers.SimpleRouter(trailing_slash=False,)
router.register(r'freelancer', FreelancerViewset)
router.register(r'manager', ManagerViewset)
router.register(r'pentester', PentesterViewset)
router.register(r'note', NotesViewset)
router.register(r'team', TeamViewset)
router.register(r'vulnerability', VulnerabilityViewset)
router.register(r'vuln-type', VulnTypeViewset)
router.register(r'mission', MissionViewset)
router.register(r'nmap', NmapViewset)
router.register(r'client-info', ClientInfoViewset)
router.register(r'credentials', CredentialViewset)
router.register(r'download-report', GeneratePDFReportView,
                basename='download-report')
router.register(r'mailing-list', MailingListViewset)
router.register(r'survey-responses', SurveyResponseViewset)
router.register(r'pusher', SendMessageViewSet, basename='pusher')

urlpatterns = [
    path(r'crtsh', CrtShView.as_view()),
    path(r'login', LoginView.as_view(), name='knox_login'),
    path('mfa', MFAView.as_view()),
    path('logout', LogoutView.as_view(), name='knox_logout'),
    path('ping', PingView.as_view()),
    path('confirm', ConfirmAccountView.as_view()),
    path('reset', ResetPasswordView.as_view()),
    path('register', RegisterViewset.as_view({'post': 'create'})),
    re_path(r'^docs/$', SchemaView.with_ui('redoc',
            cache_timeout=0), name='schema-redoc'),
    path('search', SearchView.as_view()),
    path(r'hunt', HunterView.as_view()),
    path(r'wapp', WappProxyView.as_view()),
    path(r'saas', SaasProxyView.as_view()),
    path('survey-responses/count/',
         SurveyResponseViewset.as_view({'get': 'count_responses'})),
    path('messages', SendMessageViewSet.as_view(
        {'get': 'all_messages'}), name='all_messages'),
    path('messages/search_by_team/', SendMessageViewSet.as_view(
        {'get': 'search_messages_by_team'}), name='search_messages_by_team'),

] + router.urls
