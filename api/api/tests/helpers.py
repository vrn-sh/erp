"""helper functions for unit tests"""

from datetime import date, datetime
from typing import Any
from faker import Faker

from rest_framework.test import APIClient, APIRequestFactory

from api.models import *
from api.models.mission import Mission, Recon
from api.views import LoginView


def login_as(email: str, password: str) -> str:
    """login as specific user (email/password)"""
    login = LoginView.as_view()
    fct = APIClient()
    body = {
        'email': email,
        'password': password
    }

    response = fct.post('/login', data=body, format='json')
    assert response.status_code == 200
    return response.data['token'] # type: ignore


def create_user(
        first_name: str,
        last_name: str,
        email: str,
        password: str,
        username: str,
        UserClass: Any ,
        is_manager: bool = False,
    ) -> Any:
    """create a user that is already validated"""

    auth = Auth(
        role=2 if is_manager else 1,
        email=email,
        is_superuser=is_manager,
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


def create_random_manager() -> Manager:
    """create an admin with random name & email"""
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
    """create pentester with random mail & email"""
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

def create_team(leader: Manager, members: List[Pentester], *args, **kwargs) -> Team:
    """create a team from users & manager"""
    team = Team.objects.create(
        name=kwargs.get('name', Faker().name()),
        leader=leader,
    )

    for m in members:
        team.members.add(m)
    return team

def create_mission(leader: Manager, members: List[Pentester], *args, **kwargs) -> Mission:
    """create a mission using manager a pentesters provided as input"""

    start: date = kwargs.get('start', datetime.today())
    end: date = kwargs.get('end', datetime(year=datetime.today().year + 1, month=datetime.today().month, day=datetime.today().day))
    team: Team = kwargs.get('team', create_team(leader, members))
    recon: Recon = Recon.objects.create()

    return Mission.objects.create(
            start=start,
            end=end,
            team=team,
            created_by=leader.auth,
            last_updated_by=leader.auth,
            recon=recon,
            )
