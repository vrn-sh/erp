import os
import requests
import json
import re

from typing import Any, Dict, List
from dateutil.parser import parse
from requests.exceptions import ConnectTimeout, ReadTimeout


CRTSH_API_BASE_URL = "http://crt.sh/?q="


def fetch_certificates_from_crtsh(domain: str) -> List[Dict[str, Any]]:
    """
    Fetches certificates for a given domain using the crt.sh API.

    :param domain: The domain to search for certificates.
    :return: A list of certificates.
    """

    # bypassing the request if we are running tests in order not to overload the
    # crt.sh API
    if os.environ.get('TEST', '0') == '1' or os.environ.get('CI', '0') == '1':
        return [{'testing': 'dummy data'}]

    try:
        r = requests.get(
            f"{CRTSH_API_BASE_URL}{domain}&output=json",
            timeout=(1, 5),
        )
    except ConnectTimeout:
        return [{'error': "could not connect to crt.sh API. Service is down."}]

    except ReadTimeout:
        return [{'error': "could not read from crt.sh API. Service is overloaded."}]

    nameparser = re.compile('([a-zA-Z]+)=("[^"]+"|[^,]+)')
    certs: List[Dict[str, Any]] = []
    try:
        for c in r.json():
            certs.append({
                    "id": c["id"],
                    "logged_at": parse(c["entry_timestamp"]),
                    "not_before": parse(c["not_before"]),
                    "not_after": parse(c["not_after"]),
                    "name": c["name_value"],
                    "ca": {
                        "caid": c["issuer_ca_id"],
                        "name": c["issuer_name"],
                        "parsed_name": dict(nameparser.findall(c["issuer_name"])),
                    },
                }
            )

    except json.decoder.JSONDecodeError:
        return [{'error': 'could not parse json response.'}]
    return certs
