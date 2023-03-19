# Generated by Django 4.1.7 on 2023-03-18 14:29

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Auth',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('role', models.PositiveSmallIntegerField(choices=[(1, 'pentester'), (2, 'admin')], editable=False)),
                ('password', models.CharField(max_length=128)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('tmp_token', models.CharField(default=None, max_length=32, null=True)),
                ('is_disabled', models.BooleanField(default=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Basic user auth model',
                'verbose_name_plural': 'Basic user auth models',
                'ordering': ['email'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='ImageModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
            ],
            options={
                'verbose_name': 'Image Model',
                'verbose_name_plural': 'Image models',
                'ordering': [],
            },
        ),
        migrations.CreateModel(
            name='Manager',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateTimeField(auto_now=True)),
                ('auth', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Manager',
                'verbose_name_plural': 'Managers',
                'ordering': ['creation_date'],
            },
        ),
        migrations.CreateModel(
            name='Pentester',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateTimeField(auto_now=True)),
                ('auth', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Pentester',
                'verbose_name_plural': 'Pentesters',
                'ordering': ['creation_date'],
            },
        ),
        migrations.CreateModel(
            name='VulnType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name': 'Vulnerability TYPE Model',
                'verbose_name_plural': 'Vulnerability TYPES models',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Vulnerability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField(blank=True, max_length=8186)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated_date', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='author', to=settings.AUTH_USER_MODEL)),
                ('images', models.ManyToManyField(blank=True, default=None, to='api.imagemodel')),
                ('last_editor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_editor', to=settings.AUTH_USER_MODEL)),
                ('vuln_type', models.OneToOneField(blank=True, on_delete=django.db.models.deletion.CASCADE, to='api.vulntype')),
            ],
            options={
                'verbose_name': 'Vulnerability Model',
                'verbose_name_plural': 'Vulnerability models',
                'ordering': ['creation_date'],
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('leader', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.manager')),
                ('members', models.ManyToManyField(blank=True, to='api.pentester')),
            ],
            options={
                'verbose_name': 'Team',
                'verbose_name_plural': 'Teams',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(max_length=8186)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated_date', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Mission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duration', models.FloatField(default=1)),
                ('start', models.DateField()),
                ('end', models.DateField()),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated_date', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(blank=True, default='Unnamed mission', max_length=256)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by', to=settings.AUTH_USER_MODEL)),
                ('last_updated_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_updated_by', to=settings.AUTH_USER_MODEL)),
                ('team', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.team')),
            ],
            options={
                'verbose_name': 'Mission',
                'verbose_name_plural': 'Missions',
                'ordering': ['start'],
            },
        ),
    ]
