"""helper function to manage models"""

import re
from typing import Callable, List, Optional, Tuple
from django.db import models


class NmapPortField(models.Field):
    description = "Nmap Port"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, _, __):
        if value is None:
            return value
        port_number, state, protocol, service, metadata = value.split(",", 4)
        port = NmapPort()

        port.port_number = port_number
        port.state = state
        port.protocol = protocol
        port.service = service
        port.metadata = metadata

        return port

    def to_python(self, value):
        if isinstance(value, NmapPort):
            return value
        if value is None:
            return value
        port_number, state, protocol, service, metadata = value.split(",", 4)
        port = NmapPort()

        port.port_number = port_number
        port.state = state
        port.protocol = protocol
        port.service = service
        port.metadata = metadata
        return port

    def get_prep_value(self, value):
        if value is None:
            return None
        return f"{value.port_number},{value.state},{value.protocol},{value.service},{value.metadata or ''}"

    def get_internal_type(self):
        return "TextField"

    # pylint: disable=arguments-differ
    def formfield(self, **kwargs):
        return None


class NmapPort:
    """class meant to represent a parsed line from .nmap file"""

    state: str                          # open || closed
    protocol: str                       # tcp || udp
    port_number: int                    # 0 > port_number > 65635 (2^16)
    service: str                        # http, ...
    metadata: Optional[str]             # Apache version x.xx, etc...

    def __str__(self):
        return f"{self.protocol.upper()} {self.port_number}/{self.service} ({self.state}): {self.metadata or ''}"



class NmapParser:
    """class for parsing .nmap files (not XMLs, out of convenience for the user)"""

    ports: List[NmapPort]               = []
    ip_addrs: List[str]                 = []
    os_details: Optional[str]           = None

    version_nmap: str                   = ''
    scan_date: str                      = ''


    def __clear(self):
        self.ports = []
        self.ip_addrs = []
        self.os_details = None
        self.version_nmap = ''
        self.scan_date = ''

    def ___parser_was_successful(self) -> bool:
        return self.version_nmap != '' and self.ports != [] and self.ip_addrs != []

    def __check_if_port_state(self, line: str) -> bool:
        return line.startswith('PORT')

    def __check_port_done(self, line: str) -> bool:
        return not line[:2].isnumeric() and not line.startswith('|')

    def __return_false(self, _: str) -> bool:
        return False

    def __parse_os_detail(self, line: str) -> bool:
        # if we have OS details, we can just set it here
        # OS details: Linux 2.6.13 - 2.6.31, Linux 2.6.18
        if line.startswith('OS details: '):
            self.os_details = line.lstrip('OS details: ')
            return True

        return True

    def __parse_header(self, line: str) -> bool:
        """will return True on successful parsing"""

        nmap_scan_str = 'Nmap scan report for '
        if line.startswith(nmap_scan_str):
            ip_addr = line.lstrip(nmap_scan_str)
            self.ip_addrs.append(ip_addr)
            return True

        # pattern for the nmap version & scan date
        pattern = r'(?:Starting )?Nmap ([\w.-]+)?.*?(?: at | scan initiated )(.*?)(?: as:|$)'
        if rgx_match := re.match(pattern, line):

            if len(rgx_match.groups()) != 2: return False

            self.version_nmap = rgx_match.group(1)
            self.scan_date = rgx_match.group(2)

        return True


    def __parse_port(self, line: str) -> bool:
        """will return True on successful parsing"""


        # we have additional info for the last parsed port
        if line[0] == '|':

            if self.ports == []: return False

            if not self.ports[-1].metadata:
                self.ports[-1].metadata = line[1:]
                return True

            self.ports[-1].metadata += ' ' + line[1:]
            return True

        # we _should_ have a new port
        #
        # always    always always  not always
        # 22/tcp    open   ssh     OpenSSH 4.3 (protocol 2.0)
        #

        pattern = r'^(\d+)\/(tcp|udp|TCP|UDP)\s+(open|closed|OPEN|CLOSED)\s+(\S+)\s*(.*?)$'
        if matches := re.match(pattern, line):

            nb_groups = len(matches.groups())
            if nb_groups < 4: return False

            port_nb = int(matches.group(1)) if matches.group(1).isdigit() else -1
            if port_nb == -1: return False

            port = NmapPort()
            port.port_number=port_nb
            port.protocol=matches.group(2)
            port.state=matches.group(3)
            port.service=matches.group(4)
            port.metadata=matches.group(5) if nb_groups == 5 else None

            self.ports.append(port)
            return True

        return False


    def run(self, nmap_output: str) -> bool:
        """runs parser & returns True if parsing was successful"""

        #
        # typical nmap run is split in the following parts
        # for each run. Some parts are not always there, will need to
        # write example with multiple different runs
        # so that we can ensure it runs smoothly
        #
        # each time we change state, the index is incremented
        # the mapped callable is a function that shall check for the next state
        #

        self.__clear()

        parsing_index = 0
        parsing_states: List[Tuple[str, Callable, Callable]] = [
            ('header',  self.__check_if_port_state, self.__parse_header),
            ('ports',   self.__check_port_done,     self.__parse_port),
            ('footer',  self.__return_false,        self.__parse_os_detail),
        ]

        for line in nmap_output.splitlines():

            line = line.strip()
            _, state_check, parse_function = parsing_states[parsing_index]
            if state_check(line):
                parsing_index += 1
                continue

            if not parse_function(line): return False

        return self.___parser_was_successful()


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


minimal_nmap_output = '''Starting Nmap 7.94 ( https://nmap.org ) at 2023-09-12 18:22 CEST
Nmap scan report for voron.djnn.sh (172.67.154.8)
Host is up (0.0054s latency).
Other addresses for voron.djnn.sh (not scanned): 2606:4700:3037::6815:43a 2606:4700:3033::ac43:9a08 104.21.4.58
Not shown: 996 filtered tcp ports (no-response)
PORT     STATE SERVICE
80/tcp   open  http
443/tcp  open  https
8080/tcp open  http-proxy
8443/tcp open  https-alt

Nmap done: 1 IP address (1 host up) scanned in 12.63 seconds'''
