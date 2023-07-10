"""module handling hunter.io integration"""

import os
import requests


class Hunter:
    def __init__(self) -> None:
        self.api_key = os.environ['HUNTER_API_KEY']
        self.base_url = 'https://api.hunter.io/v2'

    def get_domain(self, domain: str) -> dict:
        """returns domain info"""
        return requests.get(
            f'{self.base_url}/domain-search',
            params={
                'domain': domain,
                'api_key': self.api_key,
            }
        ).json()

    def verify_email(self, email: str) -> dict:
        """returns email info"""
        return requests.get(
            f'{self.base_url}/email-verifier',
            params={
                'email': email,
                'api_key': self.api_key,
            }
        ).json()

    def get_email_finder(self, first_name: str, last_name: str, domain: str) -> dict:
        """returns email info"""
        return requests.get(
            f'{self.base_url}/email-finder',
            params={
                'first_name': first_name,
                'last_name': last_name,
                'domain': domain,
                'api_key': self.api_key,
            }
        ).json()
