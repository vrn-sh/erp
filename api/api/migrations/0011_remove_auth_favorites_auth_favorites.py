# Generated by Django 4.2.3 on 2023-07-17 16:30

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_vulnerability_options_clientinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='auth',
            name='favorites',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=32), blank=True, null=True, size=4),
        ),
    ]