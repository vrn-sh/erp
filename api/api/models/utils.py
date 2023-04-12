"""helper function to manage models"""

import re
from typing import List, Optional
from django.db import models



class NmapPort:
    def __init__(
        self, port_number: int, version: Optional[str], state: str, protocol: str, service: str, metadata: str
    ):
        self.port_number = port_number
        self.version = version
        self.state = state
        self.protocol = protocol
        self.service = service
        self.metadata = metadata

    def __str__(self):
        return f"{self.protocol.upper()} {self.port_number}/{self.service} ({self.state}): {self.version or ''}"


class NmapPortField(models.Field):
    description = "Nmap Port"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, _, __):
        if value is None:
            return value
        port_number, version, state, protocol, service, metadata = value.split(",")
        return NmapPort(int(port_number), version, state, protocol, service, metadata)

    def to_python(self, value):
        if isinstance(value, NmapPort):
            return value
        if value is None:
            return value
        port_number, version, state, protocol, service, metadata = value.split(",")
        return NmapPort(int(port_number), version, state, protocol, service, metadata)

    def get_prep_value(self, value):
        if value is None:
            return None
        return f"{value.port_number},{value.version or ''},{value.state},{value.protocol},{value.service},{value.metadata}"

    def get_internal_type(self):
        return "TextField"

    # pylint: disable=arguments-differ
    def formfield(self, **kwargs):
        return None


def is_valid_nmap_port(port: str) -> bool:
    """
        check if each port is a valid text

        should be:
        - port/protocol closed|open service version
        - port/protocol closed|open

    """

    rgx = re.compile(r'(\d{1,5})\/(tcp|udp)[ \w]+(open|closed)[ \w]+(\S+)[ \w]+(.*)')
    return bool(rgx.match(port))


def parse_nmap_scan(nmap_scan_output: str) -> List[NmapPort]:
    """parse ports from nmap scan"""

    rgx = re.compile(r'(\d{1,5})\/(tcp|udp)\s+(\w+)\s+(.*?)\s*(\|.*)?\r?\n')
    port_matches = rgx.findall(nmap_scan_output)

    ports = [
            NmapPort(
                    port_number=int(port[0]),
                    protocol=port[1],
                    state=port[2],
                    service=port[3],
                    version=port[4] if port[4] != '' else None,
                    metadata=port[5] if port[5] != '' else None
                ) for port in port_matches
            ]
    return ports


def parse_nmap_ips(nmap_scan_output: str) -> List[str]:
    """get a list of all IP addresses retrieved from the nmap scan"""

    ip_regex = re.compile(r"(\d+\.\d+\.\d+\.\d+)")
    ip_matches = ip_regex.findall(nmap_scan_output)

    # removing duplicates
    return list(set(ip_matches))


def parse_nmap_domain(nmap_scan_output: str) -> Optional[str]:
    """get the domain in the first line of an nmap scan, if any"""

    # Define the regular expression to match the domain name
    domain_regex = re.compile(r"Nmap scan report for (\S+)")

    # Find the first match in the Nmap scan output
    domain_match = domain_regex.search(nmap_scan_output)
    if domain_match is not None:
        # Extract the domain name and return it
        return domain_match.group(1)

    return None
