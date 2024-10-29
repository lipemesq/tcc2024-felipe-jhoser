import networkx as nx
import math
import json

explored_nodes = 0

def main(grafo, k):
    n = len(grafo.nodes)
    i = 0
    found = False
    resultado_S = None
    global explored_nodes
    S_history = []  # List to store the history of S

    while not found and i < n:
        v_i = list(grafo.nodes)[i]
        S = [v_i]
        update(grafo, S)
        S_history.append(S.copy())  # Record the initial state of S
        c_v_i = grafo.nodes[v_i]['c_w']
        print(f'Iniciando com vértice {v_i}, c_w = {c_v_i}')
        explored_nodes += 1
        found, resultado_S = DA(grafo, S, k, S_history)
        i += 1

    if found:
        print(f'Aliança defensiva encontrada: {resultado_S}')
        print(f'Número de nós explorados: {explored_nodes}')
        print(f'Conjunto S é aliança: {is_defensive_alliance(grafo, resultado_S)}')
    else:
        print('Nenhuma aliança defensiva foi encontrada.')

    print("Histórico de S:", S_history)  # Print the history of S
    return resultado_S, S_history

def DA(grafo, S, k, S_history):
    global explored_nodes
    # Seleciona w em S que tem o maior valor de c_w
    w = max(S, key=lambda v: grafo.nodes[v]['c_w'])
    c_w = grafo.nodes[w]['c_w']

    if c_w <= 0 and len(S) == k:
        print(f'Aliança defensiva de tamanho {len(S)} encontrada: {S}')
        return True, S.copy()

    print(f'Analisando vértice {w} com c_w = {c_w} e |S| = {len(S)}')

    if c_w <= k - len(S):
        d_w = grafo.degree[w]
        t = math.ceil(d_w / 2) + 1

        W = [v for v in grafo.neighbors(w) if v not in S]

        i = 0
        found = False
        while not found and i < min(t, len(W)):
            w_i = W[i]
            if w_i not in S:
                S.append(w_i)
                print(f'Adicionando vértice {w_i} à aliança {S}')
                S_history.append(S.copy())  # Record the state of S after adding a vertex
                update(grafo, S)
                explored_nodes += 1
                found, resultado_S = DA(grafo, S, k, S_history)

                if not found:
                    print(f'Removendo vértice {w_i} de {S}, recalculando c_w.')
                    S.remove(w_i)
                    S_history.append(S.copy())  # Record the state of S after removing a vertex
                    update(grafo, S)
                else:
                    return True, resultado_S  # Aliança encontrada
            i += 1

        return False, None
    else:
        return False, None

def update(grafo, S):
    for v in S:
        Nv = list(grafo.neighbors(v))  # Obter os vizinhos de v como uma lista
        n_vizinhos = grafo.degree[v]
        required_neighbors = math.ceil(n_vizinhos / 2)

        # Encontrar a interseção entre Nv e S
        Nv_in_S = [neighbor for neighbor in Nv if neighbor in S]
        
        c_v = required_neighbors - len(Nv_in_S)
        grafo.nodes[v]['c_w'] = c_v
        print(f'Atualizando vértice {v}, novo c_w = {c_v}, vizinhos em S: {len(Nv_in_S)}, requerido: {required_neighbors}')


def is_defensive_alliance(G, S):
    for v in S:
        neighbors_in_S = sum(1 for neighbor in G[v] if neighbor in S)
        neighbors_outside_S = len(G[v]) - neighbors_in_S
        if neighbors_in_S < neighbors_outside_S:
            return False
    return True

G = nx.read_edgelist("public/inputs/6.in")
k = 5
r, steps = main(G, k)

showJson = True

if showJson:
    jsonResult = nx.node_link_data(G)
    jsonResult["steps"] = [list(step) for step in steps]
    print(json.dumps(jsonResult))
else:
    print(r)
