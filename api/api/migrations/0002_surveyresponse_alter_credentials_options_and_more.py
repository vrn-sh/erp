# Generated by Django 4.1.7 on 2024-02-07 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SurveyResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('occupation', models.CharField(max_length=100)),
                ('rating', models.PositiveSmallIntegerField()),
                ('experience', models.CharField(max_length=100)),
                ('source', models.CharField(max_length=100)),
                ('feedback', models.TextField()),
            ],
        ),
        migrations.AlterModelOptions(
            name='credentials',
            options={'ordering': ['service'], 'verbose_name': ['Credentials']},
        ),
        migrations.AlterModelOptions(
            name='crtsh',
            options={'ordering': ['id'], 'verbose_name': 'crt.sh'},
        ),
        migrations.AlterModelOptions(
            name='mission',
            options={'ordering': ['last_updated_by'], 'verbose_name': 'Mission', 'verbose_name_plural': 'Missions'},
        ),
        migrations.AlterModelOptions(
            name='notes',
            options={'ordering': ['last_updated'], 'verbose_name': 'notes'},
        ),
        migrations.AlterModelOptions(
            name='vulnerability',
            options={'ordering': ['last_updated_date'], 'verbose_name': 'Vulnerability Model', 'verbose_name_plural': 'Vulnerability models'},
        ),
        migrations.AlterModelOptions(
            name='vulntype',
            options={'ordering': ['id'], 'verbose_name': 'Vulnerability TYPE Model', 'verbose_name_plural': 'Vulnerability TYPES models'},
        ),
        migrations.AlterField(
            model_name='reporthtml',
            name='html_file',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]
