from django.test import TransactionTestCase
from faker import Faker

from rest_framework.test import APIClient
from api.models import Manager, Pentester, Auth

from api.tests.helpers import create_random_pentester, create_random_manager, default_user_password, login_as


class TeamTestCase(TransactionTestCase):

    def setUp(self) -> None:
        self.user: Pentester = create_random_pentester()
        self.manager: Manager = create_random_manager()

    def tearDown(self) -> None:
        self.user.delete()
        self.manager.delete()

    def test_create_and_update_valid_case(self) -> None:
        """
            logged in user can create a Mission, update it then delete it
        """
        client: APIClient = APIClient()

        auth_token: str = login_as(self.manager.auth.email, default_user_password())
        client.credentials(HTTP_AUTHORIZATION=f'Token {auth_token}')

        # preparing fake data
        fake_name: str = Faker().name()

        # creating a team
        data: dict[str, str] = {
                'name': fake_name,
                'members': [self.user.id]
        }
        resp = client.post('/team', format='json', data=data)
        self.assertEqual(resp.status_code, 201)

        team_id = resp.data['id']
        response = client.post(
            "/mission",
            format='json',
            data={
                'title': 'ERP - eip team',
                'start': '2022-01-01',
                'end': '2024-01-01',
                'team': team_id,
                'scope': ["*.djnn.sh", "10.10.0.1/24"],
            }
        )
        self.assertEqual(response.status_code, 201)
        id: str = response.data['id']
        response = client.patch(
            f"/mission/{id}",
            format='json',
            data={'title': "Eurk"}
        )
        self.assertEqual(response.status_code, 200)

        response = client.delete(
            f"/mission/{id}",
        )
        self.assertEqual(response.status_code, 204)
