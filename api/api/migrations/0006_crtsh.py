# Generated by Django 4.2 on 2023-04-27 04:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_mission_team_alter_team_leader'),
    ]

    operations = [
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
