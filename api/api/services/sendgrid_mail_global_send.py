import os
import base64
import logging
import requests
import re
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, To, Attachment, FileContent, FileName, FileType, Disposition, ContentId
from typing import Optional
import sys


class SendgridParameters:
    """Sendgrid parameters"""
    DEFAULT_SENDER = os.getenv(
        "SENDGRID_SENDER", "YOUR_SENDGRID_SENDER")
    SENDGRID_API_KEY = os.getenv(
        "SENDGRID_API_KEY", "YOUR_SENDGRID_KEY")
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

    def set_template_data(self, data: dict, recipient_email: str, username: Optional[str] = None):
        """Set dynamic data for the template"""
        first_name = self.extract_first_name(recipient_email)
        data["username"] = username or first_name
        self.mail.dynamic_template_data = data

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
    url = "https://v0ron.djnn.sh/api/mailing-list"
    response = requests.get(url)
    return response.json().get("results", [])


def get_recipients_with_profile(token):
    headers = {"Authorization": f"Token {token}"}

    pentester_data = requests.get(
        "https://v0ron.djnn.sh/api/pentester", headers=headers).json().get("results", [])
    manager_data = requests.get(
        "https://v0ron.djnn.sh/api/manager", headers=headers).json().get("results", [])

    recipients_with_profile = {}
    for data in pentester_data + manager_data:
        email = data["auth"]["email"]
        profile_image = data["auth"]["profile_image"]
        recipients_with_profile[email] = profile_image

    return recipients_with_profile


if __name__ == "__main__":
    token = '93043e1e16490d5acae5fa51110aee3a00e6fb92582cfb7b985c0fd8ffa913ce893c4bcc9815a45fdf30732514f9d83b0b0a32dca3554c3c706680ebb6d47a25'

    try:
        pentester_data = requests.get(
            "https://v0ron.djnn.sh/api/pentester", headers={"Authorization": f"Token {token}"}).json().get("results", [])
    except requests.exceptions.JSONDecodeError:
        print("Error fetching pentester data. JSON Decode Error.")
        pentester_data = []

    try:
        manager_data = requests.get(
            "https://v0ron.djnn.sh/api/manager", headers={"Authorization": f"Token {token}"}).json().get("results", [])
    except requests.exceptions.JSONDecodeError:
        print("Error fetching manager data. JSON Decode Error.")
        manager_data = []

    recipients_with_profile = get_recipients_with_profile(token)

    recipients = get_recipients()

    template_name = sys.argv[1] if len(sys.argv) > 1 else "default"

    for recipient_data in recipients:
        email_address = recipient_data.get("email").lower()

        username = None
        for data in pentester_data + manager_data:
            if data["auth"]["email"] == email_address:
                username = data.get("auth", {}).get("username")
                break

        profile_image_url = recipients_with_profile.get(email_address, None)

        email_client = SendgridClient(recipient=email_address)

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
                "profile": profile_image_url,
                "date": "31st of January",
                "celebration": "To celebrate Voron's first year !",
                "email": email_address
            }, recipient_email=email_address, username=username)
        elif template_name == "information":
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_INFORMATION
            email_client.set_template_data({
                "text": """Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte.""",
                "profile": profile_image_url,
                "date": "31st of January",
                "celebration": "To celebrate Voron's first year !",
                "email": email_address
            }, recipient_email=email_address, username=username)
        elif template_name == "promotion":
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_PROMOTION
            email_client.set_template_data({
                "date": "31st of January",
                "celebration": "To celebrate Voron's first year !",
                "email": email_address
            }, recipient_email=email_address, username=username)
        elif template_name == "survey_scripting":
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_SURVEY_SCRIPTING
            email_client.set_template_data({
                # no data
            }, recipient_email=email_address, username=username)
        elif template_name == "survey":
            email_client.mail.template_id = SendgridParameters.TEMPLATE_ID_SURVEY
            email_client.set_template_data({
                # no data
            }, recipient_email=email_address, username=username)
        response = email_client.send()
        print(f"Email sent to {email_address} using template '{template_name}'. Response:",
              response.status_code)
