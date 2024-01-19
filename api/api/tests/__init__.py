
from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient, APITestCase
from api.models import Freelancer
from api.models.mission import Mission

from api.tests.helpers import create_random_pentester, create_random_manager, default_user_password, \
        login_as


#
# import unit tests from other files here
from .notes_tests import *
from .vuln_tests import *
from .mission_tests import *
# from .report_tests import * (requires S3 to run)



class AuthTestCase(TransactionTestCase):

    """
        Tests if accounts can be logged in (manager or pentester) and logged out
        also tests for wrong password
    """

    def setUp(self) -> None:
        self.user = create_random_pentester()
        self.manager = create_random_manager()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()

    def test_can_login_pentester_account(self) -> None:
        """any valid pentester account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.user.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.get('/ping')
        self.assertEqual(response.status_code, 200) # type: ignore

    def test_can_login_manager_account(self) -> None:
        """any valid manager account should be able to log in"""

        client = APIClient()
        auth_token = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

    def test_can_logout_account(self) -> None:
        """any account should be able to log out"""

        client = APIClient()
        auth_token = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post('/logout')
        self.assertEqual(response.status_code, 204) # type: ignore

    def test_unknown_account(self) -> None:
        """unknown account should get 400"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': 'email@email.com', 'password': '1234'}
                )
        self.assertEqual(response.status_code, 400) # type: ignore

    def test_wrong_password(self) -> None:
        """wrong password should get 400"""

        client = APIClient()
        response = client.post(
                '/login',
                format='json',
                data={'email': self.manager.auth.email, 'password': '1234'}
                )
        self.assertEqual(response.status_code, 400) # type: ignore


class RegisterTestCase(TransactionTestCase):
    """
        Tests account registration feature
    """

    def test_can_register_new_pentester(self) -> None:
        """a new pentester should be able to be registered!"""

        client = APIClient()
        fake = Faker()

        name = fake.name()
        registration_settings = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 201) # type: ignore


    def test_invalid_data(self) -> None:
        """random invalid date should not be accepted"""

        client = APIClient()
        registration_settings = {
                'first_name': 'kendrick',
                }
        response = client.post('/register', format='json', data=registration_settings)
        self.assertEqual(response.status_code, 400) # type: ignore

class CRUDManagerTestCase(TransactionTestCase):
    """tests CRUD for manager accounts"""

    def setUp(self) -> None:
        self.manager = create_random_manager()
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

    def tearDown(self) -> None:
        response = self.client.post('/logout')
        self.assertEqual(response.status_code, 204)
        self.manager.delete()

    def test_create_a_manager(self):
        """a manager should be created no problem"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_manager(self):
        """we should be able to update a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)
        name = fake.name()
        update_data = {
            "auth": {
                "username": name.split(' ')[0],
                "email": fake.email(),
                "first_name": name.split(' ')[0],
                "last_name": name.split(' ')[1],
                "role": 1,
                "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.get(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/manager/{manager_id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_manager(self):
        """we should be able to delete a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.delete(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 204)


class CRUDManagerTestCase(TransactionTestCase):
    """tests CRUD for manager accounts"""

    def setUp(self) -> None:
        self.manager = create_random_manager()
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

    def tearDown(self) -> None:
        response = self.client.post('/logout')
        self.assertEqual(response.status_code, 204)
        self.manager.delete()

    def test_create_a_manager(self):
        """a manager should be created no problem"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)


    def test_update_a_manager(self):
        """we should be able to update a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)
        name = fake.name()
        update_data = {
            "auth": {
                "username": name.split(' ')[0],
                "email": fake.email(),
                "first_name": name.split(' ')[0],
                "last_name": name.split(' ')[1],
                "role": 1,
                "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.get(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 200)

        resp = self.client.patch(f'/manager/{manager_id}', format='json', data=update_data)
        self.assertEqual(resp.status_code, 200)

    def test_delete_a_manager(self):
        """we should be able to delete a manager"""

        fake = Faker()
        name = fake.name()
        creation_data = {
          "auth": {
            "username": name.split(' ')[0],
            "email": fake.email(),
            "first_name": name.split(' ')[0],
            "last_name": name.split(' ')[1],
            "password": default_user_password()
          },
          "creation_date": "2022-12-17T21:36:37.402Z"
        }
        resp = self.client.post('/manager', format='json', data=creation_data)
        self.assertEqual(resp.status_code, 201)

        manager_id: str = resp.data["id"] # type: ignore
        resp = self.client.delete(f'/manager/{manager_id}', format='json')
        self.assertEqual(resp.status_code, 204)


class CRUDTeamTestCase(TransactionTestCase):
    """
        tests scenarios for Team CRUD

        1. create a team as manager
        2. should not create team as pentester
        3. update team settings
        4. delete team
        5. should fail to create team if wrong input is supplied
        6. pentester should be able to read data
    """

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.other_user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

        self.uri = '/team'

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()
        self.other_user.delete()

    def test_create_a_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)


    def test_fail_if_pentester_creates_team(self):

        # login as pentester
        self.client = APIClient()
        self.auth_token = login_as(self.user.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 403)


    def test_update_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = self.client.patch(
            f'{self.uri}/{team_id}',
            format='json',
            data={
                'name': fake_name,
                'members': [self.user.id, self.other_user.id]
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_delete_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = self.client.delete(
            f'{self.uri}/{team_id}',
            format='json',
        )
        self.assertEqual(response.status_code, 204)

    def test_fail_if_wrong_input(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'members': [fake_name]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 400)

    def test_pentester_can_read_team(self):

        # login as manager
        self.client = APIClient()
        self.auth_token = login_as(self.manager.auth.email, default_user_password())
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.auth_token}') # type: ignore

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = self.client.post(self.uri, format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']

        # logging in as pentester
        self.pentester_client = APIClient()
        auth_token = login_as(self.user.auth.email, default_user_password())
        self.pentester_client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}') # type: ignore

        resp = self.pentester_client.get(f'{self.uri}/{team_id}', format='json')
        self.assertEqual(resp.status_code, 200)


class FreelancerTestCase(APITestCase):
    """
        test case to demonstrate the usability of freelancer role
        should be able to:

            1. create their account
            2. log in
            3. create a mission
            4. add vulns to that mission
            5. submit a recon task (nmap trace for instance)
            6. request pdf generation
            7. log out
    """

    def test_can_go_through_full_process(self):

        #
        # freelancer settings
        #

        fake = Faker()
        api = APIClient()

        first_name = fake.name().split(' ')[0]
        last_name = fake.name().split(' ')[1]
        email = fake.email()
        passwd = default_user_password()

        #
        # 1. Freelancer can create their account
        #

        freelancer_settings = {
            "auth": {
                "username": 'freelancer1337',
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "password": passwd,
                "role": "freelancer",
              },
              "creation_date": "2022-12-17T21:36:37.402Z",
        }

        response = api.post('/register', format='json', data=freelancer_settings)
        self.assertEqual(response.status_code, 201) # type: ignore

        freelancer = Freelancer.objects.filter(auth__email=email).first()  # type: ignore
        self.assertNotEqual(None, freelancer)

        #
        # 2. Freelancer can login
        #

        freelancer.auth.is_enabled = True
        freelancer.auth.set_password(passwd)
        freelancer.auth.save()

        auth_token = login_as(email, passwd)
        api.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        #
        # 3. Create a mission
        #

        mission_settings = {
            'title': 'freelancing',
            'start': '2022-01-01',
            'end': '2024-01-01',
            'scope': ["*.djnn.sh", "10.10.0.1/24"],
        }

        response = api.post('/mission', format='json', data=mission_settings)
        self.assertEqual(response.status_code, 201)  # type: ignore

        #
        # 4. Add vulns to the mission
        #


        # ensure vuln types are in database
        call_command('init_builtin_vuln_types')

        mission_id = response.data['id']  # type: ignore
        response = api.post(
            '/vulnerability',
            format='json',
            data={
                'mission': mission_id,
                'title': 'String Error Termination (freelancer by the way)',
                'vuln_type': 'Cross-Site Scripting (XSS)',
                'severity': 6.5,
                'screenshots': []
            }
        )

        self.assertEqual(response.status_code, 201)  # type: ignore

        #
        # 5. submit a recon task
        #

        mission = Mission.objects.get(id=mission_id)  # type: ignore

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

        recon_settings = {
            'nmap_file': nmap_file,
            'recon_id': mission.recon.id,   # type: ignore
        }

        response = api.post('/nmap', format='json', data=recon_settings)
        self.assertEqual(response.status_code, 201)  # type: ignore


        #
        # 6. remove mission
        #

        response = api.delete(f'/mission/{mission_id}', format='json')
        self.assertEqual(response.status_code, 204)  # type: ignore

