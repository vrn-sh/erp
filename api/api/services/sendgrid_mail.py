import os
import base64
import logging
import requests
import re
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, Attachment, FileContent, FileName, FileType, Disposition, ContentId
from typing import Optional
import warnings
from api.models.mailing_list import MailingListItem


class SendgridParameters:
    """Sendgrid parameters"""
    DEFAULT_SENDER = os.getenv(
        "SENDGRID_SENDER", "YOUR_SENGRID_SENDER")
    SENDGRID_API_KEY = os.getenv(
        "SENDGRID_API_KEY", "YOUR_SENGRID_KEY")
    TEMPLATE_ID_WELCOME = os.getenv(
        "SENDGRID_TEMPLATE_ID_WELCOME", "YOUR_TEMPLATE_ID_WELCOME")
    TEMPLATE_ID_INFORMATION = os.getenv(
        "SENDGRID_TEMPLATE_ID_INFORMATION", "YOUR_TEMPLATE_ID_INFORMATION")
    TEMPLATE_ID_PROMOTION = os.getenv(
        "SENDGRID_TEMPLATE_ID_PROMOTION", "YOUR_TEMPLATE_ID_PROMOTION")
    TEMPLATE_ID_SURVEY = os.getenv(
        "SENDGRID_TEMPLATE_ID_SURVEY", "YOUR_TEMPLATE_ID_SURVEY")
    TEMPLATE_ID_SURVEY_SCRIPTING = os.getenv(
        "SENDGRID_TEMPLATE_ID_SURVEY_SCRIPTING", "YOUR_TEMPLATE_ID_SURVEY_SCRIPTING")


class SendgridClient:
    """Sendgrid integration API"""

    def __init__(self, recipient: str, sender: Optional[str] = SendgridParameters.DEFAULT_SENDER):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)
        self.sendgrid_client = SendGridAPIClient(
            api_key=SendgridParameters.SENDGRID_API_KEY)
        self.mail = Mail(sender, To(recipient), subject=None)

    def extract_first_name(self, email: str):
        """Extract first name from email using regex"""
        match = re.match(r"^[^._@]+", email)
        return match.group() if match else ""

    def set_template_id(self, template_id: str):
        """Set template ID before sending email"""
        self.mail.template_id = template_id

    def set_template_data(self, data: dict, recipient_email: Optional[str] = None):
        """Set dynamic data for the template"""
        if recipient_email:
            first_name = self.extract_first_name(recipient_email)
            data["username"] = first_name
        else:
            data["username"] = "user"
        self.mail.dynamic_template_data = {
            **data
        }

    def set_attachment(self, filename: str, content: bytes, **kwargs):
        """Set file attachment"""
        file_type = kwargs.get("type", "application/pdf")
        content_id = kwargs.get("content_id", "attachment.pdf")
        attachment = Attachment()
        attachment.file_content = FileContent(
            base64.b64encode(content).decode('utf-8'))
        attachment.file_type = FileType(file_type)
        attachment.file_name = FileName(filename)
        attachment.disposition = Disposition('attachment')
        attachment.content_id = ContentId(content_id)
        self.mail.attachment = attachment

    def send(self):
        """Send email"""
        if os.environ.get('TEST', '0') == '1':
            self.logger.warning('[DEBUG] Email has hit .send() function')
            return
        try:
            return self.sendgrid_client.send(self.mail)
        except Exception as error:
            self.logger.exception(error)
            raise


def get_recipients():
    mailing_list_items = MailingListItem.objects.all()
    recipients = [item.email for item in mailing_list_items]
    return recipients


def send_mail_to_recipients():
    recipients = get_recipients()

    for recipient_data in recipients:
        email_address = recipient_data.get("email").lower()

        email_client = SendgridClient(recipient=email_address)

        template_name = "welcome"

        if template_name == "welcome":
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_WELCOME
            email_client.set_template_data({
                "text": """Welcome to our service!
                
We are thrilled to have you as part of the Voron community. Your decision to join us is a significant step towards unlocking a world of opportunities and possibilities.

Our team is dedicated to providing you with the best experience possible. Whether you are a new user exploring our platform or a returning customer, we are here to assist you at every step.

Feel free to navigate through our user-friendly interface, and discover the exciting features we have tailored just for you. Should you have any questions or need assistance, our support team is available 24/7 to address your queries.

Thank you for choosing Voron. We look forward to serving you and making your experience with us truly exceptional.

Best regards,
The Voron Team""",
                "profile": "",
                "date": "31st of January",
                "celebration": "To celebrate Voron's first year !",
                "email": email_address
            }, recipient_email=email_address)

        response = email_client.send()

        warnings.warn(
            f"Email sent to {email_address}. Response: {response.status_code}")


if __name__ == "__main__":
    send_mail_to_recipients()
