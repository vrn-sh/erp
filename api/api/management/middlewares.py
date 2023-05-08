"""
    middleware to set OWASP secure headers in any response from the API

    04/05/2023: temporarily dropped support before investigation regarding
    API calls which are sometimes unavailable with these headers

    FIXME(djnn): investigate this when i have 5 minutes
"""


import os
import secure


def is_in_prod() -> bool:
    """check if unit tests are running"""
    return os.environ.get('TEST', '0') != '1' and \
            os.environ.get('PRODUCTION', '0') == '1'

if is_in_prod():
    secure_headers = secure.Secure()

def set_secure_headers(get_response):
    def middleware(request):
        response = get_response(request)

        if is_in_prod():
            secure_headers.framework.django(response)
        return response

    return middleware
