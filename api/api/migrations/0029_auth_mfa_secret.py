# Generated by Django 4.2.3 on 2023-12-06 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_auth_has_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='auth',
            name='mfa_secret',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
