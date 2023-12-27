# api/api/views/viewsets/mailingList.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models.mailing_list import MailingListItem
from api.serializers.mailing_list import MailingListItemSerializer
from rest_framework.decorators import action

class MailingListViewset(viewsets.ModelViewSet):
    queryset = MailingListItem.objects.all()
    serializer_class = MailingListItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['post'], url_path='unsubscribe')
    def unsubscribe(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the mailing list item with the given email
        try:
            mailing_list_item = MailingListItem.objects.get(email=email)
        except MailingListItem.DoesNotExist:
            # Return a custom error response
            return Response({'error': 'Email not found in the mailing list'}, status=status.HTTP_404_NOT_FOUND)

        # Delete the found item
        mailing_list_item.delete()

        return Response({'message': 'Unsubscribed successfully'}, status=status.HTTP_200_OK)
