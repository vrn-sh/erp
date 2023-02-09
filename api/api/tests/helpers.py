"""helper functions for unit tests"""

from typing import Any
from faker import Faker

from rest_framework.test import APIRequestFactory

from api.models import *
from api.views import LoginView




def login_as(email: str, password: str) -> str:
    """login as specific user (email/password)"""
    login = LoginView.as_view()
    fct = APIRequestFactory()
    body = {
        'email': email,
        'password': password
    }

    request = fct.post('/login', data=body, format='json')
    response = login(request)
    assert response.status_code == 201
    return response.data['token'] # type: ignore


def create_user(
        first_name: str,
        last_name: str,
        email: str,
        password: str,
        username: str,
        UserClass: Any ,
        is_admin: bool = False,
    ) -> Any:

    """create a user that is already validated"""

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
    """give password to user"""
    return 'secretpassword'


def create_random_admin() -> Admin:
    """create an admin with random name & email"""
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
    """create customer with random mail & email"""
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
