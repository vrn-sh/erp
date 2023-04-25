import requests
from typing import List, Dict

CRTSH_API_BASE_URL = "https://crt.sh/?q="


def fetch_certificates_from_crtsh(domain: str) -> List[Dict[str]]:
    """
    Fetches certificates for a given domain using the crt.sh API.

    :param domain: The domain to search for certificates.
    :return: A list of certificates.
    """
    response = requests.get(f"{CRTSH_API_BASE_URL}{domain}&output=json")

    if response.status_code == 200:
        return response.json()
    else:
        return []
