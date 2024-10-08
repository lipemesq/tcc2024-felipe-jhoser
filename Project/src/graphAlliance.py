import json
import itertools
import networkx as nx

# Function to check if a given set of vertices forms a defensive alliance
def is_defensive_alliance(G, S):
    for v in S:
        neighbors_in_S = sum(1 for neighbor in G[v] if neighbor in S)
        neighbors_outside_S = len(G[v]) - neighbors_in_S
        if neighbors_in_S < neighbors_outside_S:
            return False
    return True


# Modified version of the FPT algorithm to find the largest defensive alliance of size <= k
def fpt_largest_defensive_alliance(G, k):
    V = list(G.nodes)
    largest_alliance = None

    # Start from size k and go down to find the largest possible alliance
    for size in range(k, 0, -1):
        for subset in itertools.combinations(V, size):
            if is_defensive_alliance(G, subset):
                return subset  # Return as soon as we find the largest valid alliance
    return largest_alliance

# Example: Finding the largest defensive alliance with size at most 4
with open("public/examples/4", "r") as file:
    string_data = file.read()  # Read the content of the file

# G = string_to_graph(string_io_data)  # Pass the file-like object to the function
G = nx.read_edgelist("public/examples/4")  # Ler diretamente do arquivo

print("G = ", G)
print("Vertices: ", G.nodes)
print("Arestas: ", G.edges)

k = 7
result = fpt_largest_defensive_alliance(G, k)
print("Maior aliança defensiva encontrada:", result)