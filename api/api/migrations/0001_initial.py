# Generated by Django 4.2 on 2023-05-04 13:10

import api.models.utils
from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.contrib.postgres.fields
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
                ('role', models.PositiveSmallIntegerField(choices=[(1, 'pentester'), (2, 'manager')], editable=False)),
                ('password', models.CharField(max_length=128)),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_enabled', models.BooleanField(default=False)),
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
            name='Manager',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateField(auto_now=True)),
                ('auth', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Manager',
                'verbose_name_plural': 'Managers',
                'ordering': ['creation_date'],
            },
        ),
        migrations.CreateModel(
            name='Mission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateField()),
                ('end', models.DateField()),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now_add=True)),
                ('title', models.CharField(blank=True, default='Unnamed mission', max_length=256)),
                ('scope', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=64), max_length=64, size=None)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by', to=settings.AUTH_USER_MODEL)),
                ('last_updated_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Mission',
                'verbose_name_plural': 'Missions',
                'ordering': ['start'],
            },
        ),
        migrations.CreateModel(
            name='Pentester',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('creation_date', models.DateField(auto_now=True)),
                ('auth', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Pentester',
                'verbose_name_plural': 'Pentesters',
                'ordering': ['creation_date'],
            },
        ),
        migrations.CreateModel(
            name='Recon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Recon data',
                'verbose_name_plural': 'Recon data',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='VulnType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
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
                ('serverity', models.FloatField()),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated_date', models.DateTimeField(auto_now_add=True)),
                ('images', django.contrib.postgres.fields.ArrayField(base_field=models.ImageField(upload_to=''), blank=True, null=True, size=None)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='author', to=settings.AUTH_USER_MODEL)),
                ('last_editor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_editor', to=settings.AUTH_USER_MODEL)),
                ('mission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.mission')),
                ('vuln_type', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.vulntype')),
            ],
            options={
                'verbose_name': 'Vulnerability Model',
                'verbose_name_plural': 'Vulnerability models',
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32)),
                ('leader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.manager')),
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
                ('title', models.TextField(default='New note')),
                ('content', models.TextField(max_length=8186)),
                ('creation_date', models.DateField(auto_now=True)),
                ('last_updated', models.DateTimeField(auto_now_add=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('mission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.mission')),
            ],
        ),
        migrations.CreateModel(
            name='NmapScan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_timestamp', models.DateTimeField(auto_now=True)),
                ('ips', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=32), size=None)),
                ('ports', django.contrib.postgres.fields.ArrayField(base_field=api.models.utils.NmapPortField(), size=None)),
                ('recon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.recon')),
            ],
            options={
                'verbose_name': 'Nmap data',
                'verbose_name_plural': 'Nmap data',
                'ordering': ['id'],
            },
        ),
        migrations.AddField(
            model_name='mission',
            name='recon',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.recon'),
        ),
        migrations.AddField(
            model_name='mission',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.team'),
        ),
        migrations.CreateModel(
            name='CrtSh',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dump', models.TextField()),
                ('recon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.recon')),
            ],
            options={
                'verbose_name': 'crt.sh',
            },
        ),
    ]
