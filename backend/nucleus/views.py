import networkx as nx
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (UserSignupSerializer, UserLoginSerializer, GroupSerializer, ChoreSerializer,
                          TransactionSerializer, DebtSerializer, MinimizedDebtSerializer)
from django.contrib.auth import get_user_model
from .models import Group, Chore, Transaction, Debt, TransactionParticipant, MinimizedDebt

import io
import matplotlib.pyplot as plt
from django.http import HttpResponse
from nucleus.utils.graph import (create_debt_graph, calculate_minimized_transactions, create_minimized_debt_graph)
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

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
                first_name = user.first_name
                last_name = user.last_name
                user_id = user.id
                return Response({
                    'token': token.key,
                    'session_id': session_id,
                    'user_id': user_id,
                    'first_name': first_name,
                    'last_name': last_name,
                }, status=status.HTTP_200_OK)
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSignupSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


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
        members = list(group.members.all())
        members = [member.id for member in members]
        serializer = GroupSerializer(group, data=request.data)
        member_emails = request.data.get('members')
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
                    serializer = UserSignupSerializer(data=new_user_data)
                    if serializer.is_valid():
                        serializer.save()
                    member = User.objects.get(email=member_email)
                members.append(member.id)
        members = list(set(members))
        serializer.initial_data['members'] = members

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
                                                                            karma_owed=per_member_share, net_balance=(
                    -per_member_share if user != done_by else karma_value - per_member_share))

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
                    debt_amount = debt_data.get(debt.to_user.get_full_name(), 0) - debt.karma
                    debt_data[debt.to_user.get_full_name()] = debt_amount
                    debit -= debt.karma
                for debt in taken:
                    debt_amount = debt_data.get(debt.from_user.get_full_name(), 0) + debt.karma
                    debt_data[debt.from_user.get_full_name()] = debt_amount
                    credit += debt.karma

                debt_info = [
                    {
                        "debtor": user.get_full_name() if debt_data[x] > 0 else x,
                        "creditor": x if debt_data[x] > 0 else user.get_full_name(),
                        "debt_amount": abs(debt_data[x])
                    }
                    for x in debt_data if x != user.get_full_name() and debt_data[x] != 0
                ]

                response.append({'user': user.get_full_name(), 'debit': debit, 'credit': credit, "data": debt_info})

            return Response(response, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)


class ListGroupMinimizedDebtsView(APIView):
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
                given = MinimizedDebt.objects.filter(group=group, from_user=user)
                taken = MinimizedDebt.objects.filter(group=group, to_user=user)
                for debt in given:
                    debt_amount = debt_data.get(debt.to_user.get_full_name(), 0) - debt.karma
                    debt_data[debt.to_user.get_full_name()] = debt_amount
                    debit -= debt.karma
                for debt in taken:
                    debt_amount = debt_data.get(debt.from_user.get_full_name(), 0) + debt.karma
                    debt_data[debt.from_user.get_full_name()] = debt_amount
                    credit += debt.karma

                debt_info = [
                    {
                        "debtor": user.get_full_name() if debt_data[x] > 0 else x,
                        "creditor": x if debt_data[x] > 0 else user.get_full_name(),
                        "debt_amount": abs(debt_data[x])
                    }
                    for x in debt_data if x != user.get_full_name() and debt_data[x] != 0
                ]

                response.append({'user': user.get_full_name(), 'debit': debit, 'credit': credit, "data": debt_info})

            return Response(response, status=status.HTTP_200_OK)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)


class EqualizeKarmaView(APIView):
    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
        group.delete_minimized_debts()
        graph = create_debt_graph(group_id)
        minimized_graph = calculate_minimized_transactions(graph)
        debts = []
        for edge in minimized_graph.edges(data=True):
            from_user = User.objects.get(id=edge[1])
            to_user = User.objects.get(id=edge[0])
            weight = edge[2]['capacity']

            debt = MinimizedDebt.objects.create(from_user=from_user, to_user=to_user, karma=weight)
            group.minimized_debts.add(debt)
            debts.append(debt)

        serializer = MinimizedDebtSerializer(debts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListGroupTransactionsView(APIView):
    def get(self, request, group_id):
        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return Response({'message': 'Group not found'}, status=status.HTTP_404_NOT_FOUND)
        transactions = Transaction.objects.filter(group=group).select_related('done_by')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------ GRAPH ------------------

@api_view(['GET'])
def graph_image(request, group_id):
    graph = create_debt_graph(group_id)
    # graph = simplify_debts(graph)
    calculate_minimized_transactions(graph)

    for u, v, data in graph.edges(data=True):
        print(f"{u} owes {v}: {data['capacity']}")

    # Create a buffer to store image data
    buffer = io.BytesIO()

    # Create the plot
    plt.figure(figsize=(12, 8))

    # pos = nx.spring_layout(graph)  # Positions for all nodes
    # pos = nx.circular_layout(graph)
    # pos = nx.kamada_kawai_layout(graph)
    # pos = nx.shell_layout(graph)
    # pos = nx.spectral_layout(graph)
    pos = nx.planar_layout(graph)
    # pos = nx.random_layout(graph)

    # labels = nx.get_node_attributes(graph, 'label')

    # Draw nodes and edges
    # nx.draw(graph, pos, labels=labels, with_labels=True, node_size=700, node_color='lightblue')

    nx.draw_networkx_nodes(graph, pos, node_color='r', node_size=100, alpha=1)
    nx.draw_networkx_labels(graph, pos, font_size=8)

    # ax = plt.gca()
    nx.draw_networkx_edges(graph, pos, connectionstyle='arc3, rad=0.1')

    # for e in graph.edges:
    #     ax.annotate("",
    #                 xy=pos[e[0]], xycoords='data',
    #                 xytext=pos[e[1]], textcoords='data',
    #                 arrowprops=dict(arrowstyle="->", color="0.5",
    #                                 shrinkA=5, shrinkB=5,
    #                                 patchA=None, patchB=None,
    #                                 connectionstyle="arc3,rad=rrr".replace('rrr', str(0.3 * e[2])
    #                                                                        ),
    #                                 ),
    #                 )
    # plt.axis('off')

    # Draw edge labels (weights)
    edge_capacities = nx.get_edge_attributes(graph, 'capacity')
    # Format edge labels, e.g., 'u-v: capacity'
    edge_labels = {(u, v): f'{capacity}' for (u, v), capacity in edge_capacities.items()}
    # for (u, v) in edge_labels:
    #     print(f'{User.objects.get(id=u).first_name} owes {User.objects.get(id=v).first_name}: {edge_labels[(u, v)]}')

    nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels, font_size=8, label_pos=0.3)

    plt.title("Debt Graph")

    # Save the plot to the buffer
    canvas = FigureCanvas(plt.gcf())
    canvas.print_png(buffer)
    plt.close()  # Close the plot after saving

    # Reset the buffer position to the start
    buffer.seek(0)

    # Send the buffer in a HTTP response
    response = HttpResponse(buffer.getvalue(), content_type='image/png')
    response['Content-Length'] = str(len(response.content))

    return response
