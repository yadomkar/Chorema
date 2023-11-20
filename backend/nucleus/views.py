from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSignupSerializer, UserLoginSerializer, GroupSerializer, ChoreSerializer, \
    TransactionSerializer, DebtSerializer
from django.contrib.auth import get_user_model
from .models import Group, Chore, Transaction, Debt, TransactionParticipant

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

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
                session_id = request.session.session_key
                return Response({'token': token.key, 'session_id': session_id}, status=status.HTTP_200_OK)
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


#
# class CreateGroupView(APIView):
#     serializer_class = GroupSerializer
#
#     def post(self, request):
#         user_email = request.data.get('user_email')
#         request.data['members'] = [User.objects.get(email=user_email).id]
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': f'Group {serializer.data.get("group_name")} Created successfully'})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class ViewUserGroupsView(APIView):
#     def get(self, request):
#         user_email = request.data.get('user_email')
#         user = User.objects.get(email=user_email)
#         groups = Group.objects.filter(members__in=[user.id])
#         serializer = GroupSerializer(groups, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#

# class AddUserToGroupView(APIView):
#     def post(self, request):
#         group_name = request.data.get('group_name')
#         user_email = request.data.get('user_email')
#         user = User.objects.get(email=user_email)
#         group = Group.objects.get(group_name=group_name)
#         if user not in group.members.all():
#             group.members.add(user.id)
#             return Response({'message': f'User {user_email} successfully added to group {group.group_name}'})
#         return Response({'message': 'User already exists in the group'}, status=status.HTTP_400_BAD_REQUEST)


# class BulkAddUsersToGroupView(APIView):
#     def post(self, request):
#         group_name = request.data.get('group_name')
#         user_emails = request.data.get('user_emails')
#         group = Group.objects.get(group_name=group_name)
#         for user_email in user_emails:
#             user = User.objects.get(email=user_email)
#             if user not in group.members.all():
#                 group.members.add(user.id)
#         return Response({'message': f'Users {user_emails} successfully added to group {group.group_name}'})
#

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


# ------------ GROUPS ------------------
class CreateGroupView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'message': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        group_data = {
            'group_name': request.data.get('group_name'),  # You can modify this based on your request data
            'members': [str(request.user.id)],  # Add the current user to the members list
        }

        serializer = GroupSerializer(data=group_data)
        if serializer.is_valid():
            group = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListGroupsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({'message': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Filter groups where the user is a member
        groups = Group.objects.filter(members__id=request.user.id)
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GroupDetailView(APIView):
    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            serializer = GroupSerializer(group)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)


class UpdateGroupView(APIView):
    """
    Give group name and member email IDs to add members to a group. Also group ID in url.
    """

    def put(self, request, group_id):
        group = Group.objects.get(id=group_id)
        serializer = GroupSerializer(group, data=request.data)
        member_emails = request.data.get('members')
        members = []
        if member_emails:
            for member_email in member_emails:
                try:
                    member = User.objects.get(email=member_email)
                except User.DoesNotExist:
                    new_user_data = {
                        'email': member_email,
                        'first_name': "Temp",
                        'last_name': "User",
                        'password': 'password'
                    }
                    member = UserSignupSerializer(data=new_user_data)
                members.append(member.id)
        serializer.initial_data['members'] = members

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BulkAddUsersToGroupView(APIView):
#     def post(self, request):
#         group_id = request.data.get('group_id')
#         user_emails = request.data.get('user_emails')
#         group = Group.objects.get(group_id=group_id)
#         for user_email in user_emails:
#             user = User.objects.get(email=user_email)
#             if user not in group.members.all():
#                 group.members.add(user.id)
#         return Response({'message': f'Users {user_emails} successfully added to group {group.group_name}'})


class DeleteGroupView(APIView):
    def delete(self, request, group_id):
        group = Group.objects.get(id=group_id)
        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------ CHORES ------------------
class ListChoresView(APIView):
    """
    Send group id and get list of chores for that group.
    """

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            chores = Chore.objects.filter(group=group)
            serializer = ChoreSerializer(chores, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)


class CreateChoreView(APIView):
    def post(self, request):
        serializer = ChoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChoreDetailView(APIView):
    def get(self, request, chore_id):
        try:
            chore = Chore.objects.get(id=chore_id)
            serializer = ChoreSerializer(chore)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Chore.DoesNotExist:
            return Response({'message': 'Chore not found'}, status=status.HTTP_404_NOT_FOUND)


class UpdateChoreView(APIView):
    def put(self, request, chore_id):
        chore = Chore.objects.get(id=chore_id)
        serializer = ChoreSerializer(chore, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteChoreView(APIView):
    def delete(self, request, chore_id):
        chore = Chore.objects.get(id=chore_id)
        chore.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AssignChoreView(APIView):
    def post(self, request):
        chore_id = request.data.get('chore_id')
        chore = Chore.objects.get(id=chore_id)
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        chore.assigned_to = user
        chore.save()
        return Response({'message': f'Chore {chore.name} assigned to {user.get_full_name()}'})


# # ------------------ TRANSACTIONS ------------------

class CreateTransactionView(APIView):
    """
    This view is basically for DO THE TASK.
    """
    serializer_class = TransactionSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'message': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        done_by = request.user
        group = request.data.get('group')
        try:
            group = Group.objects.get(id=group)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
        name = request.data.get('name')
        description = request.data.get('description')
        users_involved = request.data.get('users_involved')
        try:
            users_involved = [User.objects.get(id=user) for user in users_involved]
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        chore = request.data.get('chore')
        try:
            chore = Chore.objects.get(id=chore)
        except Chore.DoesNotExist:
            return Response({'message': 'Chore not found'}, status=status.HTTP_404_NOT_FOUND)
        karma_value = chore.karma_value
        per_member_share = karma_value / len(users_involved)

        settlements = []
        transaction = Transaction.objects.create(name=name, description=description, group=group,
                                                 karma_value=karma_value, done_by=done_by, chore=chore)

        for user in users_involved:
            if user != done_by:
                debt = Debt.objects.create(from_user=done_by, to_user=user, karma=per_member_share)
                group.debts.add(debt)
                settlements.append(debt)
            transaction_participant = TransactionParticipant.objects.create(user=user, transaction=transaction,
                                                                            karma_earned=(
                                                                                0 if user != done_by else per_member_share),
                                                                            karma_owed=per_member_share, net_balance=(-per_member_share if user != done_by else karma_value - per_member_share))

        transaction.settlements.set(settlements)
        transaction.users_involved.set(users_involved)
        transaction.save()
        return Response({'message': 'Expense Created successfully'})


class ListGroupDebtsView(APIView):
    """
    Send group id and get list of debts for that group.
    """

    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
            users = group.members.all()

            response = []
            for user in users:
                debt_data = {}
                debit = 0
                credit = 0
                given = Debt.objects.filter(group=group, from_user=user)
                taken = Debt.objects.filter(group=group, to_user=user)
                for debt in given:
                    debt_data[debt.to_user.get_full_name()] = debt_data.get(debt.to_user.get_full_name(), 0) - debt.karma
                    debit -= debt.karma
                for debt in taken:
                    debt_data[debt.from_user.get_full_name()] = debt_data.get(debt.from_user.get_full_name(), 0) + debt.karma
                    credit += debt.karma
                response.append({'user': user.get_full_name(), 'debit': debit, 'credit': credit, "data": [f'User {user.get_full_name()} owes {debt_data[x]} to user {x}' if debt_data[x] > 0 else f'User {x} owes {-1 * debt_data[x]} to {user.get_full_name()}' for x in debt_data if x != user.get_full_name() and debt_data[x] != 0],})

            return Response(response, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)