# api/api/views/viewsets/mailingList.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models.mailingList import MailingListItem
from api.serializers.mailingList import MailingListItemSerializer

class MailingListViewset(viewsets.ModelViewSet):
    queryset = MailingListItem.objects.all()
    serializer_class = MailingListItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
