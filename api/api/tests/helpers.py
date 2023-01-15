
from api.models import *
from api.models.domains import *
from api.views import LoginView

from rest_framework.test import APIRequestFactory, force_authenticate, APIClient

from faker import Faker

def login_as(email: str, password: str):
    login = LoginView.as_view()
    fct = APIRequestFactory()
    body = {
        'email': email,
        'password': password
    }

    request = fct.post('/login', data=body, format='json')
    response = login(request)
    assert response.status_code == 201
    return response.data['token']


def create_user(
        first_name: str,
        last_name: str,
        email: str,
        password: str,
        username: str,
        UserClass,
        is_admin: bool = False,
    ):

    auth = Auth(
        role=2 if is_admin else 1,
        email=email,
        is_superuser=is_admin,
        username=username,
        first_name=first_name,
        last_name=last_name,
        is_active=True,
        password=password,
    )
    auth.set_password(password)
    auth.save()

    user = UserClass(auth=auth)
    user.save()
    return user


def random_user_password() -> str:
    return 'secretpassword'


def create_random_admin() -> Admin:
    fake = Faker()
    name = fake.name()

    return create_user(
        name.split(' ')[0],
        name.split(' ')[1],
        fake.email(),
        random_user_password(),
        name,
        Admin,
        True
    )


def create_random_customer() -> Customer:
    fake = Faker()
    name = fake.name()

    return create_user(
        name.split(' ')[0],
        name.split(' ')[1],
        fake.email(),
        random_user_password(),
        name,
        Customer,
        False
    )
