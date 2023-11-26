import networkx as nx
import matplotlib.pyplot as plt
from nucleus.models import Group, Debt, MinimizedDebt


# def create_debt_graph(group_id):
#     G = nx.DiGraph()
#
#     # Adding nodes
#     # G.add_node("Gabe", label="Gabe")
#     # G.add_node("Bob", label="Bob")
#     # G.add_node("David", label="David")
#     # G.add_node("Fred", label="Fred")
#     # G.add_node("Charlie", label="Charlie")
#     # G.add_node("Ema", label="Ema")
#     #
#     # G.add_edge("Gabe", "Bob", capacity=30)
#     # G.add_edge("Gabe", "David", capacity=10)
#     # G.add_edge("Fred", "Bob", capacity=10)
#     # G.add_edge("Fred", "Charlie", capacity=30)
#     # G.add_edge("Fred", "David", capacity=10)
#     # G.add_edge("Fred", "Ema", capacity=10)
#     # G.add_edge("Bob", "Charlie", capacity=40)
#     # G.add_edge("Charlie", "David", capacity=20)
#     # G.add_edge("David", "Ema", capacity=50)
#
#     G.add_node("Alice", label="Alice")
#     G.add_node("Bob", label="Bob")
#     G.add_node("Charlie", label="Charlie")
#
#     G.add_edge("Alice", "Bob", capacity=10)
#     G.add_edge("Alice", "Charlie", capacity=20)
#     G.add_edge("Bob", "Charlie", capacity=30)
#
#
#     return G

def create_debt_graph(group_id):
    try:
        group = Group.objects.get(id=group_id)
        users = group.members.all()

        G = nx.DiGraph()  # Directed graph, since debts are directional

        # Add nodes
        for user in users:
            G.add_node(user.id, label=user.first_name)

        # Add or update edges with debts as weights
        for debt in Debt.objects.filter(group=group):
            from_user = debt.to_user.id
            to_user = debt.from_user.id
            capacity = debt.karma if debt.karma is not None else 0

            if G.has_edge(from_user, to_user):
                # If an edge already exists, add to its weight
                G[from_user][to_user]['capacity'] += capacity
            else:
                # Otherwise, create a new edge with the initial weight
                G.add_edge(from_user, to_user, capacity=capacity)

        return G

    except Group.DoesNotExist:
        return None


def create_minimized_debt_graph(group_id):
    try:
        group = Group.objects.get(id=group_id)
        users = group.members.all()

        G = nx.DiGraph()  # Directed graph, since debts are directional

        # Add nodes
        for user in users:
            G.add_node(user.id, label=user.first_name)

        # Add or update edges with debts as weights
        for debt in MinimizedDebt.objects.filter(group=group):
            from_user = debt.to_user.id
            to_user = debt.from_user.id
            capacity = debt.karma if debt.karma is not None else 0

            if G.has_edge(from_user, to_user):
                # If an edge already exists, add to its weight
                G[from_user][to_user]['capacity'] += capacity
            else:
                # Otherwise, create a new edge with the initial weight
                G.add_edge(from_user, to_user, capacity=capacity)

        return G

    except Group.DoesNotExist:
        return None


def dinitz_max_flow(G, s, t):
    R = nx.algorithms.flow.dinitz(G, s, t, capacity='capacity')
    return R.graph['flow_value'], R


def calculate_minimized_transactions(OG):
    visited_edges = set()
    G = OG

    for first_edge in OG.edges(data=True):
        u = first_edge[0]
        v = first_edge[1]
        if (u, v) in visited_edges:
            continue

        visited_edges.add((u, v))

        # print("S: " + u + "T: " + v)

        # capacity = OG[u][v]['capacity']
        flow_value, R = dinitz_max_flow(G, u, v)
        # print(R.edges(data=True))
        new_edges = []

        for e in R.edges(data=True):
            print(e)

            remaining_flow = e[2]['capacity'] if e[2]['flow'] < 0 else (e[2]['capacity'] - e[2]['flow'])
            if remaining_flow > 0:
                new_edges.append((e[0], e[1], remaining_flow))

        new_G = nx.DiGraph()
        new_G.add_nodes_from(OG.nodes(data=True))

        for edge in new_edges:
            new_G.add_edge(edge[0], edge[1], capacity=edge[2])

        if flow_value > 0:
            new_G.add_edge(u, v, capacity=flow_value)
        G = new_G

    # print(visited_edges)
    return G


def visualize_graph(graph):
    plt.figure(figsize=(12, 8))
    # pos = nx.spring_layout(graph)  # Positions for all nodes
    # pos = nx.circular_layout(graph)
    # pos = nx.kamada_kawai_layout(graph)
    # pos = nx.shell_layout(graph)
    # pos = nx.spectral_layout(graph)
    pos = nx.planar_layout(graph)
    # pos = nx.random_layout(graph)

    # Extract labels from node attributes
    labels = nx.get_node_attributes(graph, 'label')

    # Draw the graph using the ID as node identifiers but the first name as labels
    nx.draw(graph, pos, labels=labels, with_labels=True, node_size=700, node_color='lightblue')

    # Draw edge labels (weights)
    edge_labels = nx.get_edge_attributes(graph, 'weight')
    nx.draw_networkx_edge_labels(graph, pos, edge_labels=edge_labels)

    plt.show()
