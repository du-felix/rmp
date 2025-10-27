from django.db import models

class Professor(models.Model):
    SEX_CHOICES = [
        ('Frau', 'Frau'),
        ('Herr', 'Herr'),
    ]
    prof_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=30)
    sex = models.CharField(
        max_length=10,
        choices=SEX_CHOICES,
    )
    department = models.ForeignKey('Department', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.sex} {self.title} {self.name}"


class University(models.Model):
    uni_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=10)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    professors = models.ManyToManyField(Professor, related_name='courses')
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.code} - {self.name}"
class Rating(models.Model):
    rating_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=50,
        choices=[
            ("current", "Currently attending"),
            ("completed", "Completed"),
        ],
    )
    rating_text = models.TextField(max_length=500, blank=True)
    tags = models.ManyToManyField('Tag', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Rating {self.rating_id} for {self.course.code} by {self.professor.name}"
    
class RatingCategory(models.Model):
    rating_category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    label = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class RatingScore(models.Model):
    rating_score_id = models.AutoField(primary_key=True)
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, related_name="scores")
    category = models.ForeignKey(RatingCategory, on_delete=models.CASCADE, related_name="scores")
    score = models.PositiveSmallIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.category.name}: {self.score}"

class Tag(models.Model):
    tag_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name
