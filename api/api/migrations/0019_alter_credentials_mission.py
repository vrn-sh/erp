# Generated by Django 4.2.3 on 2023-09-21 14:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_alter_mission_options_alter_mission_created_by_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credentials',
            name='mission',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='credentials', to='api.mission'),
        ),
    ]
