
from api.models import *
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
        is_manager: bool = False,
    ):
    two_fa = TwoFactorAuth(method=1)
    two_fa.save()

    auth = Auth(
        role=2 if is_manager else 1,
        email=email,
        is_superuser=is_manager,
        username=username,
        first_name=first_name,
        last_name=last_name,
        is_active=True,
        password=password,
        two_factor=two_fa
    )
    auth.set_password(password)
    auth.save()

    user = UserClass(auth=auth)
    user.save()
    return user


def random_user_password() -> str:
    return 'secretpassword'


def create_random_manager() -> Manager:
    fake = Faker()
    name = fake.name()

    return create_user(
        name.split(' ')[0],
        name.split(' ')[1],
        fake.email(),
        random_user_password(),
        name,
        Manager,
        True
    )


def create_random_pentester() -> Pentester:
    fake = Faker()
    name = fake.name()

    return create_user(
        name.split(' ')[0],
        name.split(' ')[1],
        fake.email(),
        random_user_password(),
        name,
        Pentester,
        False
    )
