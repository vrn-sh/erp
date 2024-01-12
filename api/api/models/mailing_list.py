from django.db import models


class MailingListItem(models.Model):
    """
    MailingListItem model

    Represents a single entry in the mailing list.

    email: Email field to store the user's email address
    """

    class Meta:
        verbose_name = 'Mailing List Item'
        verbose_name_plural = 'Mailing List Items'

    email = models.EmailField(unique=True, null=False, blank=False)

    def __str__(self):
        return self.email
