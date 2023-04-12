"""helper functions related to model CRUDs"""

from api.models.mission import NmapScan
from api.models.utils import is_valid_nmap_port


def parse_nmap_text(fulltext: str) -> NmapScan:
    """will transform typical nmap output to NmapScan object"""


