# Generated by Django 4.2.1 on 2023-05-10 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_mission_bucket_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mission',
            name='bucket_name',
            field=models.CharField(blank=True, max_length=48, null=True),
        ),
    ]
