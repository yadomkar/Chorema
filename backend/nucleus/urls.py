from django.urls import path
from .views import UserSignupView, UserLoginView, UserLogoutView, CreateGroupView, DeleteUserView, AddUserToGroupView, RemoveUserFromGroupView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('delete-user/', DeleteUserView.as_view(), name='delete-user'),
    path('create-group/', CreateGroupView.as_view(), name='create-group'),
    path('add-user-to-group/', AddUserToGroupView.as_view(), name='add-user-to-group'),
    path('remove-user-from-group/', RemoveUserFromGroupView.as_view(), name='remove-user-from-group'),
]
