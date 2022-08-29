from datetime import datetime
from rest_framework import serializers
from .models import note
from django.contrib.auth import get_user_model


class UserSerializer(serializers.Serializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', "email"]
    
class NotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = note
        fields = ("id", "user","title", "note", "updated")
       
    def create(self, validated_data):
        nota = note.objects.create(
            user = validated_data["user"],
            title = validated_data["title"],
            note = validated_data["note"],
            updated = datetime.time,    
        )  
        return nota  
    
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
        
        