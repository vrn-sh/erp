"""module to handle sendgrid integration"""

import os
from typing import Optional
import logging
from sendgrid import SendGridAPIClient, Mail
from sendgrid.helpers.mail import *

class SendgridParameters:
    """Sendgrid parameters"""
    DEFAULT_SENDER = os.environ.get('SENDGRID_SENDER')
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')


class SendgridClient:
    """Sendgrid integration API"""

    def __init__(self, recipients: list[str],
                 sender: Optional[str] = SendgridParameters.DEFAULT_SENDER):
        self.logger = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO)

        self.sendgrid_client = SendGridAPIClient(SendgridParameters.SENDGRID_API_KEY)
        self.mail = Mail(
            from_email=sender,
            to_emails=recipients,
        )

    def set_template_data(self, data: dict):
        """Send back a dictionnary with the data to be substituted"""
        self.mail.dynamic_template_data = {
            **data
        }

    def set_template_id(self, template_id: str):
        """Set template ID before sending email"""
        self.mail.template_id = template_id

    def set_attachment(self, filename: str, content: bytes, **kwargs):
        """Set file attachment"""
        file_type = kwargs.get("type", "application/pdf")
        content_id = kwargs.get("content_id", "Pentest_report.pdf")

        attachment = Attachment()
        attachment.file_content = base64.b64encode(content).decode('utf-8')
        attachment.file_type = FileType(file_type)
        attachment.file_name = FileName(filename)
        attachment.disposition = Disposition('attachment')
        attachment.content_id = ContentId(content_id)

        self.mail.attachment = attachment

    def send(self):
        """send email"""

        if os.environ.get('TEST', '0') == '1':
            logging.warning('[DEBUG] Email has hit .send() function')
            return

        try:
            response = self.sendgrid_client.send(self.mail)
        except Exception as error:
            self.logger.exception(error)
            raise error
