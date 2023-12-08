from django.urls import path
from .views import connect_api,ready_view,aichat, analysis

urlpatterns = [
    path('connect-api/', connect_api, name='connect_api'),
    path('ready/', ready_view, name='ready'),
    path('aichat/', aichat, name='aichat'),
    path('analysis/', analysis, name='analysis'),
]

