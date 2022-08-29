from django.urls import path
from apps.notes import views
urlpatterns = [
    path("", views.notes),
    path("api/", views.HelloApiView.as_view()),
    path("api/<int:note_id>/", views.HelloApiView.as_view()),
    path("authentication/login/", views.login)
]