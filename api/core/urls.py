"""Module responsible for storing API routes & OpenAPI config"""

from rest_framework import routers
from rest_framework import permissions
from rest_framework.urls import path

from django.conf.urls.static import static
from django.urls import re_path

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from api.views import LoginView, LogoutView, PingView, ConfirmAccountView, ResetPasswordView
from api.views.viewsets import RegisterViewset, PentesterViewset, AdminViewset

from api.views.viewsets.vulns import NotesViewset, VulnerabilityViewset, VulnTypeViewset


# SchemaView provides view for OpenAPI specifications (using Redoc template)
SchemaView = get_schema_view(
   openapi.Info(
      title="voron API",
      default_version='1.0',
      description="API storing and managing notes, users, and stuff",
      terms_of_service="https://github.com/vrn-sh/erp/blob/current/LICENSE",
      contact=openapi.Contact(email="voron@djnn.sh"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

router = routers.SimpleRouter(trailing_slash=False,)
router.register(r'admin', AdminViewset)
router.register(r'pentester', PentesterViewset)
router.register(r'notes', NotesViewset)
router.register(r'vulnerability', VulnerabilityViewset)
router.register(r'vuln-type', VulnTypeViewset)

urlpatterns = [
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('ping', PingView.as_view()),
    path('confirm', ConfirmAccountView.as_view()),
    path('reset', ResetPasswordView.as_view()),
    path('register', RegisterViewset.as_view({'post': 'create'})),
    re_path(r'^docs/$', SchemaView.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
] + router.urls
