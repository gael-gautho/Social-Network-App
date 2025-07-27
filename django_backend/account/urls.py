from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import api
from . import views

urlpatterns = [
    path('me/', api.me, name='me'),
    path('signup/', api.signup, name='signup'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('friends/<uuid:pk>/request/', api.send_friendship_request, name='send_friendship_request'),
    path('friends/<uuid:pk>/', api.get_friends, name='friends'),
    path('friends/suggestions/', api.get_friends_suggestions, name='friends_suggestions'),
    


    path('friends/<uuid:pk>/<str:status>/', api.handle_request, name='handle_request'),
    path('editprofile/', api.editprofile, name='editprofile'),
    path('editpassword/', api.editpassword, name='editpassword'),
    path('activateemail/', views.activateemail, name='activateemail'),

]