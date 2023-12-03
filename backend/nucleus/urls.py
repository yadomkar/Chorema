from django.urls import path

from .views import UserSignupView, UserLoginView, UserLogoutView, DeleteUserView, \
    CreateChoreView, ListChoresView, ChoreDetailView, UpdateChoreView, DeleteChoreView, CreateGroupView, \
    ListGroupsView, GroupDetailView, UpdateGroupView, DeleteGroupView, CreateTransactionView, ListGroupDebtsView, \
    graph_image, UserDetailView, ListGroupTransactionsView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('delete-user/', DeleteUserView.as_view(), name='delete-user'),
    path('users/<uuid:user_id>/', UserDetailView.as_view(), name='user-detail'),
    # path('create-group/', CreateGroupView.as_view(), name='create-group'),
    # path('bulk-add-user-to-group/', BulkAddUsersToGroupView.as_view(), name='bulk-add-user-to-group'),
    # path('remove-user-from-group/', RemoveUserFromGroupView.as_view(), name='remove-user-from-group'),

    path('groups/create/', CreateGroupView.as_view(), name='create_group'),
    path('groups/', ListGroupsView.as_view(), name='list_groups'),
    path('groups/<uuid:group_id>/', GroupDetailView.as_view(), name='detail_group'),
    path('groups/update/<uuid:group_id>/', UpdateGroupView.as_view(), name='update_group'),
    path('groups/delete/<uuid:group_id>/', DeleteGroupView.as_view(), name='delete_group'),
    path('groups/debts/<uuid:group_id>/', ListGroupDebtsView.as_view(), name='list_group_debts'),
    path('groups/transactions/<uuid:group_id>/', ListGroupTransactionsView.as_view(), name='list_group_transactions'),

    path('chores/create/', CreateChoreView.as_view(), name='create_chore'),
    path('chores/list/<uuid:group_id>/', ListChoresView.as_view(), name='list_chores'),
    path('chores/<uuid:chore_id>/', ChoreDetailView.as_view(), name='detail_chore'),
    path('chores/update/<uuid:chore_id>/', UpdateChoreView.as_view(), name='update_chore'),
    path('chores/delete/<uuid:chore_id>/', DeleteChoreView.as_view(), name='delete_chore'),

    path('transactions/create/', CreateTransactionView.as_view(), name='create_transaction'),

    path('graph-image/<uuid:group_id>/', graph_image, name='graph_image'),
]