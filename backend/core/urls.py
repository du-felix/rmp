from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rmp.views import UniversityViewSet, DepartmentViewSet, ProfessorViewSet, CourseViewSet, RatingViewSet

router = routers.DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'professors', ProfessorViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'ratings', RatingViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]