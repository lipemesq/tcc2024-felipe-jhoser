import argparse
import networkx as nx
import math
import json
from typing import Tuple, Optional, Set, List, Dict
import matplotlib.pyplot as plt

debugSteps = False
explored_nodes = 0
allowSmallerAlliances = False

def main(grafo, k) -> Tuple[bool, Optional[Set[int]], List[Dict[int, int]]]:
    n = len(grafo.nodes)
    i = 0
    found = False
    resultado_S = None
    global explored_nodes
    S = []
    S_history = []  # Modified to store c_w of each node at the current moment

    while not found and i < n:
        v_i = list(grafo.nodes)[i]
        S.append(v_i)
        update(grafo, S)
        S_history.append({v: grafo.nodes[v]['c_w'] for v in S})  # Record the initial state of S and c_w of each node
        c_v_i = grafo.nodes[v_i]['c_w']
        if debugSteps: print(f'Iniciando com vértice {v_i}, c_w = {c_v_i}')
        explored_nodes += 1
        found, resultado_S = DA(grafo, S, k, S_history)
        i += 1
    return found, resultado_S, S_history

def DA(grafo, S, k, S_history):
    global explored_nodes
    
    # Seleciona w em S que tem o maior valor de c_w
    w = max(S, key=lambda v: grafo.nodes[v]['c_w'])
    c_w = grafo.nodes[w]['c_w']

    if c_w <= 0 and (len(S) == k or (allowSmallerAlliances and len(S) < k)): # TODO: Manter o limitador?
        # Todos os vértices em S estão defendidos
        if debugSteps: print(f'Aliança defensiva de tamanho {len(S)} encontrada: {S}')
        return True, S.copy()

    if debugSteps: print(f'Analisando vértice {w} com c_w = {c_w} e |S| = {len(S)}')

    if c_w <= k - len(S):
        d_w = grafo.degree[w]
        t = math.ceil(d_w / 2) + 1

        W = [v for v in grafo.neighbors(w) if v not in S]

        # Tenta expandir S adicionando cada vizinho de w que não está em S
        i = 0
        found = False
        while not found and i < min(t, len(W)):
            w_i = W[i]
            S.append(w_i)
            if debugSteps: print(f'Adicionando vértice {w_i} à aliança {S}')
            update(grafo, S)
            explored_nodes += 1
            S_history.append({int(v): grafo.nodes[v]['c_w'] for v in S})
            found, resultado_S = DA(grafo, S, k, S_history)

            if not found:
                if debugSteps: print(f'Removendo vértice {w_i} de {S}, recalculando c_w.')
                S.pop()
                update(grafo, S)
                explored_nodes += 1
                S_history.append({int(v): grafo.nodes[v]['c_w'] for v in S})
            else:
                return True, resultado_S  # Aliança encontrada
            i += 1

        # Se tentamos todos os vizinhos e não encontramos uma aliança, retrocede
        return False, None
    else:
        # Caso c_w > k - len(S), não é possível expandir S
        return False, None

def update(grafo, S):
    for v in S:
        Nv = list(grafo.neighbors(v))
        n_vizinhos = grafo.degree[v]
        required_neighbors = math.ceil(n_vizinhos / 2)

        # Encontrar a interseção entre Nv e S
        Nv_in_S = [neighbor for neighbor in Nv if neighbor in S]
        
        c_v = required_neighbors - len(Nv_in_S)
        grafo.nodes[v]['c_w'] = c_v
        if debugSteps: print(f'Atualizando vértice {v}, novo c_w = {c_v}, vizinhos em S: {len(Nv_in_S)}, requerido: {required_neighbors}')

def is_defensive_alliance(G, S):
    for v in S:
        neighbors_in_S = sum(1 for neighbor in G[v] if neighbor in S)
        neighbors_outside_S = len(G[v]) - neighbors_in_S
        if neighbors_in_S < neighbors_outside_S:
            return False
    return True

def parse_arguments():
    parser = argparse.ArgumentParser(description='Find the first defensive alliance with size of at most k in a graph.')
    parser.add_argument('--graphFromFile', type=str, help='Path to the input file')
    parser.add_argument('--v', type=int,  default=50, help='Numero de vertices ao gerar grafo aleatorio')
    parser.add_argument('--e', type=float,  default=5/100, help='Numero de arestas ao gerar grafo aleatorio')
    parser.add_argument('--k', type=int, default=5, help='Largest size of the defensive alliance to find')
    parser.add_argument('--debugSteps', action='store_true', help='Print steps along the way')
    parser.add_argument('--allowSmallerAlliances', action='store_true', help='Allow the algorithm to stops when finds a defensive alliance with size < k')
    parser.add_argument('--writeGraphToJson', type=str, help='Name of the file to write the graph to')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    debugSteps = args.debugSteps
    allowSmallerAlliances = args.allowSmallerAlliances
    
    if args.graphFromFile:
        G = nx.read_edgelist(args.input_file)
    else:
        G = nx.erdos_renyi_graph(args.v, args.e)
        
    # nx.draw(G, with_labels=1)
    # plt.show()
    found, resultAlliance, steps = main(G, args.k)

    jsonResult = dict(nx.node_link_data(G))

    if found:
        print(f'Aliança defensiva de tamanho {len(resultAlliance)} encontrada: {resultAlliance}')
        print(f'Conjunto S é aliança: {is_defensive_alliance(G, resultAlliance)}')
        print(f'Número de nós explorados e passos dados: {explored_nodes}')
        #print(f'Histórico de S ({len(steps)} passos): {steps}')  # Print the history of S estava vindo muito grande
        jsonResult["defensiveAlliances"] = [{
            "id": 0,
            "nodes": list(resultAlliance) if resultAlliance is not None else []
        }]
        jsonResult["steps"] = [
            {"id": int(index), "values": list(step.items())} for index, step in enumerate(steps)
        ]

    else:
        print('Nenhuma aliança defensiva foi encontrada.')
        jsonResult["steps"] = [
            {"id": 0, "values": []}
        ]
    
    if args.writeGraphToJson:
        with open(args.writeGraphToJson, 'w') as file:            
            file.write(json.dumps(jsonResult))

# testar inputs em https://csacademy.com/app/graph_editor/
# inputs, testados com tamanho k=5: 
# k5 tem alianças de tamanho 4 e 5, iniciando do 0
# 6.in e 7.in tbm
