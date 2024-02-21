from django.db import models


class SurveyResponse(models.Model):
    occupation = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField()
    experience = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    feedback = models.TextField()

    def __str__(self):
        return f"Survey Response - {self.occupation}"
