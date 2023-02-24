from django.db import models


class Notes(models.Model):
    """
        In order to give pentesters flexibility in their work, we should let them save simple notes about the
        current infrastructure.
    """

    content = models.TextField(max_length=2048)
    creation_date = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date = models.DateTimeField(auto_now_add=True, editable=True)
