# api/api/views/viewsets/mailingList.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models.mailing_list import MailingListItem
from api.serializers.mailing_list import MailingListItemSerializer
from rest_framework.decorators import action
from api.services.sendgrid_mail_global_send import SendgridClient, SendgridParameters


class MailingListViewset(viewsets.ModelViewSet):
    queryset = MailingListItem.objects.all()
    serializer_class = MailingListItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        email_address = serializer.validated_data['email']

        # Create SendgridClient and send welcome email
        try:
            email_client = SendgridClient(recipient=email_address)
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_WELCOME
            email_client.set_template_data({
                "text": """Welcome to our service!

We are thrilled to have you as part of the Voron community. Your decision to join us is a significant step towards unlocking a world of opportunities and possibilities.

Our team is dedicated to providing you with the best experience possible. Whether you are a new user exploring our platform or a returning customer, we are here to assist you at every step.

Feel free to navigate through our user-friendly interface, and discover the exciting features we have tailored just for you. Should you have any questions or need assistance, our support team is available 24/7 to address your queries.

Thank you for choosing Voron. We look forward to serving you and making your experience with us truly exceptional.

Best regards,
The Voron Team"""
            }, recipient_email=email_address)
            response = email_client.send()
            print(f'Welcome email sent successfully to {email_address}')
        except Exception as e:
            print(f'Error sending welcome email to {email_address}: {str(e)}')
            # Handle the error, raise or return an appropriate response

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
