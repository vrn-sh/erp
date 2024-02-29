# api/api/views/viewsets/mailingList.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models.mailing_list import MailingListItem
from api.serializers.mailing_list import MailingListItemSerializer
from rest_framework.decorators import action
from api.services.sendgrid_mail import SendgridClient, SendgridParameters


class MailingListViewset(viewsets.ModelViewSet):
    queryset = MailingListItem.objects.all()
    serializer_class = MailingListItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        email_address = serializer.validated_data['email']

        # Create SendgridClient and send information email
        try:
            email_client = SendgridClient(recipient=email_address)
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_INFORMATION
            email_client.set_template_data({
                "text": """Welcome to Our Newsletter!

Greetings from the Voron community! We're absolutely delighted to welcome you aboard. Your choice to connect with us marks the beginning of an exciting journey filled with endless possibilities and opportunities.

At Voron, we're committed to ensuring that your experience with us is nothing short of extraordinary. Whether you're just getting started on our platform or you're a seasoned member of our community, we're here to support you every step of the way.

Dive into our user-friendly platform and explore the myriad of innovative features we've designed with you in mind. If you ever have any questions or need a helping hand, remember that our dedicated support team is just a message away, ready to assist you around the clock.

Thank you for joining Voron. We're thrilled to have you with us and are eager to make your journey memorable and rewarding.

Warmest regards,
The Voron Team""",
                "date": "31st of January",
                "celebration": "To celebrate Voron's first year !",
                "email": email_address
            }, recipient_email=email_address)
            response = email_client.send()
            print(f'Welcome email sent successfully to {email_address}')
        except Exception as e:
            print(
                f'Error sending information email to {email_address}: {str(e)}')
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
