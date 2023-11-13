from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSignupSerializer, UserLoginSerializer, GroupSerializer
from django.contrib.auth import get_user_model
from .models import Group

User = get_user_model()


class UserSignupView(APIView):
    """
    Create a new user with email, first name, last name, and password.

    Request body:

    {
        "email": "",
        "first_name": "",
        "last_name": "",
        "password": ""
    }
    """

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """
    Login a user with email and password.

    Request body:
    {
        "email": ""
        "password": ""
    }
    """
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(email=serializer.validated_data['email'],
                                password=serializer.validated_data['password'])
            if user:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    """
    Logout a user.
    """
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class DeleteUserView(APIView):
    def post(self, request):
        user_email = request.data.get('user_email')
        try:
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'message': f'User {user_email} deleted successfully'})


class CreateGroupView(APIView):
    serializer_class = GroupSerializer

    def post(self, request):
        all_users = []
        for user_email in request.data.get('members', []):
            all_users.append(User.objects.get(email=user_email).id)
        request.data['members'] = all_users
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': f'Group {serializer.data.get("group_name")} Created successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddUserToGroupView(APIView):
    def post(self, request):
        group_name = request.data.get('group_name')
        user_email = request.data.get('user_email')
        user = User.objects.get(email=user_email)
        group = Group.objects.get(group_name=group_name)
        if user not in group.members.all():
            group.members.add(user.id)
            return Response({'message': f'User {user_email} successfully added to group {group.group_name}'})
        return Response({'message': 'User already exists in the group'}, status=status.HTTP_400_BAD_REQUEST)


class RemoveUserFromGroupView(APIView):
    def post(self, request):
        group_name = request.data.get('group_name')
        user_email = request.data.get('user_email')
        user = User.objects.get(email=user_email)
        group = Group.objects.get(group_name=group_name)
        if user in group.members.all():
            group.members.remove(user.id)
            return Response({'message': f'User {user_email} successfully removed from group {group.group_name}'})
        return Response({'message': 'User does not exist in the group'}, status=status.HTTP_400_BAD_REQUEST)
