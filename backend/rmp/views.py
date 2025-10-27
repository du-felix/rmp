from rest_framework import viewsets, filters
from .models import University, Department, Professor, Course, Rating, Tag, RatingScore, RatingCategory
from .serializers import UniversitySerializer, DepartmentSerializer, ProfessorSerializer, CourseSerializer, RatingSerializer, TagSerializer, RatingScoreSerializer, CategorySerializer

class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'department__name']
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class RatingScoreViewSet(viewsets.ModelViewSet):
    queryset = RatingScore.objects.all()
    serializer_class = RatingScoreSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = RatingCategory.objects.all()
    serializer_class = CategorySerializer