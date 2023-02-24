from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient

from api.tests.helpers import create_random_customer, create_random_admin, random_user_password, \
        login_as

class NotesTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user = create_random_customer()
        self.admin = create_random_admin()

    def tearDown(self) -> None:
        self.user.delete()
        self.admin.delete()

    def test_create_and_update_valid_case(self):
        """
            The logged user try to create a Note
        """
        client = APIClient()
        auth_token = login_as(self.user.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post("/notes", format='json', data={'content': '#Exploit 1\n\nThis is an exploit.'})
        self.assertEqual(response.status_code, 200)
        print(response.body)
        response = client.patch("/notes/1", format='json', data={'content': "It wasn't an exploit after all..."})
        print(response.body)
        self.assertEqual(response.status_code, 200)

    def test_create_and_update_valid_case_2(self):
        """
            This time, we are trying to test the same but logged in as an admin.
        """

        client = APIClient()
        auth_token = login_as(self.admin.auth.email, random_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')
        response = client.post("/notes", format='json', data={'content': '#Exploit 1\n\nThis is an exploit.'})
        self.assertEqual(response.status_code, 200)
        print(response.body) # TODO: get id of notes !!
        response = client.patch("/notes/1", format='json', data={'content': "It wasn't an exploit after all..."})
        print(response.body)
        self.assertEqual(response.status_code, 200)