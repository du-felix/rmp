from rest_framework import serializers
from .models import University, Department, Professor, Course, Rating, Tag, RatingScore, RatingCategory

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['dept_id', 'name', 'university']

class ProfessorSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = Professor
        fields = ['prof_id', 'name', 'department', 'title', 'sex']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_id', 'name']

class RatingScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingScore
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingCategory
        fields = '__all__'