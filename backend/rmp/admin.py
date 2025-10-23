from django.contrib import admin
from .models import University, Department, Professor, Course, Rating, RatingCategory, RatingScore, Tag


class RatingScoreInline(admin.TabularInline):
    model = RatingScore
    extra = 0
    min_num = 1


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("professor", "course", "average_score", "status", "created_at")
    list_filter = ("status", "professor", "course", "created_at")
    search_fields = ("professor__name", "course__name", "review_text")
    inlines = [RatingScoreInline]
    filter_horizontal = ("tags",)


@admin.register(RatingCategory)
class RatingCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ("name", "department")
    search_fields = ("name", "department__name")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "university")
    search_fields = ("name", "university__name")