import networkx as nx
from nucleus.models import Group, Debt


def create_debt_graph(group_id):
    try:
        group = Group.objects.get(id=group_id)
        users = group.members.all()

        G = nx.DiGraph()  # Directed graph, since debts are directional

        # Add nodes
        for user in users:
            G.add_node(user.id, label=user.first_name)

        # Add edges with debts as weights
        for debt in Debt.objects.filter(group=group):
            G.add_edge(debt.from_user.id, debt.to_user.id, weight=debt.karma)

        return G

    except Group.DoesNotExist:
        return None
