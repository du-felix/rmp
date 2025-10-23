from django.contrib import admin
from .models import University, Department, Professor, Course, Rating

admin.site.register(University)
admin.site.register(Department)
admin.site.register(Professor)
admin.site.register(Course)
admin.site.register(Rating)