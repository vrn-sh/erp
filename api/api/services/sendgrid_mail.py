import os
import base64
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, Attachment, FileContent, FileName, FileType, Disposition, ContentId
from typing import Optional

class SendgridParameters:
    """Sendgrid parameters"""
    DEFAULT_SENDER = "reggi002@cougars.csusm.edu"
    SENDGRID_API_KEY = "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"
    TEMPLATE_ID = "d-791209ddcfb545169c2ff33e8c386400"

class SendgridClient:
    """Sendgrid integration API"""

    def __init__(self, recipient: str, sender: Optional[str] = SendgridParameters.DEFAULT_SENDER):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)

        self.sendgrid_client = SendGridAPIClient(api_key=SendgridParameters.SENDGRID_API_KEY)
        self.mail = Mail(sender, To(recipient), subject=None)
        self.mail.template_id = SendgridParameters.TEMPLATE_ID  
    def set_template_data(self, data: dict):
        """Set dynamic data for the template"""
        self.mail.dynamic_template_data = data

    def set_attachment(self, filename: str, content: bytes, **kwargs):
        """Set file attachment"""
        file_type = kwargs.get("type", "application/pdf")
        content_id = kwargs.get("content_id", "attachment.pdf")

        attachment = Attachment()
        attachment.file_content = FileContent(base64.b64encode(content).decode('utf-8'))
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

if __name__ == "__main__":
    email_client = SendgridClient(recipient="rislo.reggiani@gmail.com")
    email_client.set_template_data({
        "username": "User",
        "text": "Welcome to our service!",
        "profile": "url_to_profile_image",
        "email": "rislo.reggiani@gmail.com"
    })
    response = email_client.send()
    print("Email sent. Response:", response.status_code)