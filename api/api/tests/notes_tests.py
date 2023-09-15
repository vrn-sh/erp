from logging import warn
from django.test import TransactionTestCase

from rest_framework.test import APIClient
from api.models import Manager, Pentester

from api.tests.helpers import create_mission, create_random_pentester, create_random_manager, default_user_password, login_as

class ReconTestCase(TransactionTestCase):
    """test case for all things related to recon, include Nmap etc"""

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()
        self.mission = create_mission(self.manager, [self.user, self.other_user])

        self.pentester_client = APIClient()
        auth_token = login_as(self.user.auth.email, default_user_password())
        self.pentester_client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()
        self.mission.delete()

    def test_submit_bad_nmap(self) -> None:
        badfile = "something dumb"

        response = self.pentester_client.post('/nmap', format='json', data={
            'nmap_file': badfile,
            'recon_id': self.mission.recon.id,
            })
        self.assertEqual(response.status_code, 400)

    def test_submit_good_nmap(self) -> None:
        nmap_file = """
            Nmap 5.35DC18 scan initiated Sun Jul 18 15:33:26 2010 as: ./nmap -T4 -A -oN - scanme.nmap.org
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
            # Nmap done at Sun Jul 18 15:33:48 2010 -- 1 IP address (1 host up) scanned in 22.47 seconds
        """

        response = self.pentester_client.post('/nmap', format='json', data={
            'nmap_file': nmap_file,
            'recon_id': self.mission.recon.id,
            })
        self.assertEqual(response.status_code, 201)


class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()
        self.uri = '/note'

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_and_update_valid_case(self) -> None:
        """
            logged in user can create a Note
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        mission = create_mission(self.manager, [self.user])
        response = client.post(
                self.uri,
                format='json',
                data={
                    'title': 'Exploit 1',
                    'content': 'This is an exploit.',
                    'mission': mission.id,
                    }
                )
        self.assertEqual(response.status_code, 201)
        id: str = response.data['id']
        response = client.patch(
                f"{self.uri}/{id}",
                format='json',
                data={'content': "It wasn't an exploit after all..."}
                )
        self.assertEqual(response.status_code, 200)


    def test_create_and_update_as_manager(self) -> None:
        """
            trying to test the same but logged in as an manager.
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        mission = create_mission(self.manager, [self.user])
        response = client.post(
                self.uri,
                format='json',
                data={
                    'title': 'Exploit 1',
                    'content': 'This is an exploit.',
                    'author': self.user.id,
                    'mission': mission.id,
                    }
                )
        self.assertEqual(response.status_code, 201)

        id = response.data['id']
        response = client.patch(
                f"{self.uri}/{id}",
                format='json',
                data={'content': "It wasn't an exploit after all...", 'author': self.user.id}
                )

        self.assertEqual(response.status_code, 200)

    def test_patch_invalid_case(self):
        """
            A user creates a notes, and an other one tries to patch it.
        """

        client: APIClient = APIClient()

        auth_token: str = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        mission = create_mission(self.manager, [self.user])
        response = client.post(
                self.uri,
                format='json',
                data={
                    'content': '#Exploit 1\n\nThis is an exploit.',
                    'author': self.user.id,
                    'mission': mission.id,
                    }
                )

        auth_token: str = login_as(self.other_user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        notes_id = response.data.get('id')

        response = client.patch(
                f"{self.uri}/{notes_id}",
                format='json',
                data={"content": "Je suis un petit saboteur mouihihihihih"}
                )
        self.assertEqual(response.status_code, 403)
