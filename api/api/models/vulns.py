from django.db import models


MAX_NOTE_LENGTH = 8186


class Notes(models.Model):
    """
        In order to give pentesters flexibility in their work, we should let them save simple notes about the
        current infrastructure.
    """

    # FIXME(adina): add Mission-id (ForeignKey)

    content: models.TextField = models.TextField(max_length=MAX_NOTE_LENGTH)
    creation_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated_date: models.DateTimeField = models.DateTimeField(auto_now_add=True, editable=True)
