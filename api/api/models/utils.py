"""helper function to manage models"""

import re
from typing import List, Optional
from django.db import models


class NmapPort:
    def __init__(
            self, port_number: int, state: str, protocol: str, service: str, metadata: str
    ):
        self.port_number = port_number
        self.state = state
        self.protocol = protocol
        self.service = service
        self.metadata = metadata

    def __str__(self):
        return f"{self.protocol.upper()} {self.port_number}/{self.service} ({self.state}): {self.metadata or ''}"


class NmapPortField(models.Field):
    description = "Nmap Port"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, _, __):
        if value is None:
            return value
        port_number, state, protocol, service, metadata = value.split(",")
        return NmapPort(int(port_number), state, protocol, service, metadata)

    def to_python(self, value):
        if isinstance(value, NmapPort):
            return value
        if value is None:
            return value
        port_number, state, protocol, service, metadata = value.split(",")
        return NmapPort(int(port_number), state, protocol, service, metadata)

    def get_prep_value(self, value):
        if value is None:
            return None
        return f"{value.port_number},{value.state},{value.protocol},{value.service},{value.metadata or ''}"

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
            metadata=port[4] if len(port) > 3 else None
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


default_nmap_output = '''Nmap 5.35DC18 scan initiated Sun Jul 18 15:33:26 2010 as: ./nmap -T4 -A -oN - scanme.nmap.org
Nmap scan report for scanme.nmap.org (64.13.134.52)
Host is up (0.045s latency).
Not shown: 993 filtered ports
PORT      STATE  SERVICE VERSION
22/tcp    open   ssh     OpenSSH 4.3 (protocol 2.0)
| ssh-hostkey: 1024 60:ac:4d:51:b1:cd:85:09:12:16:92:76:1d:5d:27:6e (DSA)
|_2048 2c:22:75:60:4b:c3:3b:18:a2:97:2c:96:7e:28:dc:dd (RSA)
25/tcp    closed smtp
53/tcp    open   domain
70/tcp    closed gopher
80/tcp    open   http    Apache httpd 2.2.3 ((CentOS))
| http-methods: Potentially risky methods: TRACE
|_See https://nmap.org/nsedoc/scripts/http-methods.html
|_html-title: Go ahead and ScanMe!
113/tcp   closed auth
31337/tcp closed Elite
Device type: general purpose
Running: Linux 2.6.X
OS details: Linux 2.6.13 - 2.6.31, Linux 2.6.18
Network Distance: 13 hops

TRACEROUTE (using port 80/tcp)
HOP RTT       ADDRESS
[Cut first 10 hops for brevity]
11  45.16 ms  layer42.car2.sanjose2.level3.net (4.59.4.78)
12  43.97 ms  xe6-2.core1.svk.layer42.net (69.36.239.221)
13  45.15 ms  scanme.nmap.org (64.13.134.52)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Sun Jul 18 15:33:48 2010 -- 1 IP address (1 host up) scanned in 22.47 seconds'''
