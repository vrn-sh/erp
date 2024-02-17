from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models.survey import SurveyResponse
from api.serializers.survey import SurveyResponseSerializer


class SurveyResponseViewset(viewsets.ModelViewSet):
    queryset = SurveyResponse.objects.all()
    serializer_class = SurveyResponseSerializer

    def list(self, request):
        """
        Retrieve all survey responses.
        """
        survey_responses = self.get_queryset()
        serializer = self.get_serializer(survey_responses, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """
        Create a new survey response.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def count_responses(self, request):
        """
        Count the number of survey responses.
        """
        total_responses = SurveyResponse.objects.count()
        return Response({'total_responses': total_responses}, status=status.HTTP_200_OK)
