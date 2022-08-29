from ast import ExceptHandler
from cProfile import label
import datetime
from django.shortcuts import render, redirect
from apps.notes.forms import add_note_form
from django.views.generic import View
from apps.notes.models import note
from django.contrib import messages
from .serializer import NotesSerializer, UserSerializer
from django. contrib. auth. mixins import LoginRequiredMixin
from django. contrib. auth. mixins import PermissionRequiredMixin

from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, filters
# Create your views here.

def notes(request):
    return render(request, "index.html")

def login(request):
    return render(request, "login.html")

class HelloApiView(APIView):
    serializer_class = NotesSerializer

    def get(self, request, note_id = None):
    
        if note_id is None:
            notes = [{"id":notes.id,"user":notes.user.username, "title":notes.title, "note":notes.note, "updated":notes.updated} for notes in note.objects.all()]   
            return Response({"message":"Notas","notes":notes})
        else:
            notes = [{"id":notes.id,"user":notes.user.username, "title":notes.title, "note":notes.note, "updated":notes.updated} for notes in note.objects.filter(id = note_id)]
            if notes == []:
                return Response(status = status.HTTP_404_NOT_FOUND)
            else:
                return Response({"notes":notes})
    
    def post(self, request, note_id = None):
        try:
            serializer = self.serializer_class(data = request.data)
        except :
            return Response( status = status.HTTP_400_BAD_REQUEST)    
        if serializer.is_valid():
            serializer.save()
            notes = [{"id":notes.id,"user":notes.user.username, "title":notes.title, "note":notes.note, "updated":notes.updated} for notes in note.objects.all()]   
            return Response({"message":"Notas","notes":notes}, status = status.HTTP_201_CREATED)
        else:
            return Response(
                serializer._errors,
                status = status.HTTP_400_BAD_REQUEST
            )   
    def put(self, request, note_id = None):
        try:
            serializer = self.serializer_class(data = request.data)
            if serializer.is_valid():
                nota = note.objects.get(id =note_id)
                serializer.update(nota, serializer.validated_data)
                return Response(status = status.HTTP_200_OK)
            else:
                return Response(
                    serializer.errors,
                    status = status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, note_id = None):
        if note_id is not None:
            nota = note.objects.get(id = note_id)
            if nota is None:
                return Response(status = status.HTTP_404_NOT_FOUND)
            else:
                nota.delete()
                return Response(status = status.HTTP_200_OK)
        else:
            return Response({"message":"Must give a note id"}, status = status.HTTP_404_NOT_FOUND)    
    
                
                   
    