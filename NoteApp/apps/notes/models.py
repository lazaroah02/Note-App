from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.

class note(models.Model):
    user = models.ForeignKey(User, related_name = "user", on_delete=models.CASCADE)
    title = models.CharField(max_length=100, blank=True)
    note = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.id} {self.title} {self.user}"