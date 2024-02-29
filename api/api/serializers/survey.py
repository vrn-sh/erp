from rest_framework import serializers
from api.models.survey import SurveyResponse


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = ['occupation', 'rating', 'experience', 'source', 'feedback']
