from django.db import models

class Professor(models.Model):
    prof_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=30)
    department = models.ForeignKey('Department', on_delete=models.CASCADE)


class University(models.Model):
    uni_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)

class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=10)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    professors = models.ManyToManyField(Professor, related_name='courses')
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

class Rating(models.Model):
    rating_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    score = models.IntegerField()
    difficulty = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


