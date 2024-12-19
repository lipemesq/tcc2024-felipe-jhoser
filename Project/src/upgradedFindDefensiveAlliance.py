#!/usr/bin/env python3
import argparse
import networkx as nx
import math
import json
from typing import Tuple, Optional, Set, List, Dict
from sys import getsizeof


debugSteps = False
saveHistory = False
explored_nodes = 0
allowSmallerAlliances = False
combinations = {}
skippedNodes = 0

def main(grafo, k) -> Tuple[bool, Optional[Set[int]], List[Dict[int, int]]]:
    n = len(grafo.nodes)
    i = 0
    found = False
    resultado_S = None
    global explored_nodes
    S = []
    S_history = []
    
    init_cw(grafo)

    while not found and i < n:
        v_i = list(grafo.nodes)[i]
        S.append(v_i)
        if saveHistory: S_history.append({v: grafo.nodes[v]['c_w'] for v in S})
        c_v_i = grafo.nodes[v_i]['c_w']
        if debugSteps: print(f'Iniciando com vértice {v_i}, c_w = {c_v_i}')
        explored_nodes += 1
        found, resultado_S = DA(grafo, S, k, S_history)
        if not found:
            grafo.nodes[v_i]['c_w'] += 1
            S.pop()
        i += 1
    return found, resultado_S, S_history

def DA(grafo, S, k, S_history):
    global explored_nodes
    global skippedNodes
    
    # Seleciona w em S que tem o maior valor de c_w
    w = max(S, key=lambda v: grafo.nodes[v]['c_w'])    
    c_w = grafo.nodes[w]['c_w']

    if c_w <= 0 and (len(S) == k or (allowSmallerAlliances and len(S) < k)): 
        # Todos os vértices em S estão defendidos
        if debugSteps: print(f'Aliança defensiva de tamanho {len(S)} encontrada: {S}')
        return True, S.copy()

    if debugSteps: print(f'Analisando vértice {w} com c_w = {c_w} e |S| = {len(S)}')

    if c_w <= k - len(S):
        d_w = grafo.degree[w]
        t = math.ceil(d_w / 2) + 1

        W = [v for v in grafo.neighbors(w) if v not in S]
        W.sort(key=lambda v: (-len([neighbor for neighbor in grafo.neighbors(v) if neighbor in S]), math.ceil(grafo.degree[v]/2)))

        # Tenta expandir S adicionando cada vizinho de w que não está em S
        i = 0
        found = False
        while not found and i < min(t, len(W)):
            w_i = W[i]
            
            S_ids = sorted([str(node) for node in S+[w_i]])
            S_str = '-'.join(S_ids)
            if S_str not in combinations:
                combinations[S_str] = 1
            else:
                # combinations[S_str] += 1
                i += 1
                skippedNodes += 1;
                continue
            
            if debugSteps: print(f'Adicionando vértice {w_i} à aliança {S}')
            update(grafo, S, w_i)
            S.append(w_i)
            explored_nodes += 1
            if saveHistory: S_history.append({int(v): grafo.nodes[v]['c_w'] for v in S})
            found, resultado_S = DA(grafo, S, k, S_history)

            if not found:
                if debugSteps: print(f'Removendo vértice {w_i} de {S}, recalculando c_w.')
                S.pop()
                reset(grafo, S, w_i)
                if saveHistory: S_history.append({int(v): grafo.nodes[v]['c_w'] for v in S})
            else:
                return True, resultado_S  # Aliança encontrada
            i += 1

        # Se tentamos todos os vizinhos e não encontramos uma aliança, retrocede
        return False, None
    else:
        # Caso c_w > k - len(S), não é possível expandir S
        return False, None

def init_cw(grafo):
    i = 0
    while i < len(grafo.nodes):
        grafo.nodes[i]['c_w'] = math.ceil(grafo.degree[i]/ 2)
        i += 1 


def update(grafo, S, w):
    for v in S:
        if w in list(grafo.neighbors(v)):
            grafo.nodes[v]['c_w'] -= 1
            grafo.nodes[w]['c_w'] -= 1
        c_w = grafo.nodes[v]['c_w']
        if debugSteps: print(f'Atualizando vértice {v}, novo c_w = {c_w}')

def reset(grafo, S, w):
    for v in S:
        if w in list(grafo.neighbors(v)):
            grafo.nodes[v]['c_w'] += 1
            grafo.nodes[w]['c_w'] += 1
        c_w = grafo.nodes[v]['c_w']
        if debugSteps: print(f'Atualizando vértice {v}, novo c_w = {c_w}')

def is_defensive_alliance(G, S):
    for v in S:
        neighbors_in_S = sum(1 for neighbor in G[v] if neighbor in S)
        neighbors_outside_S = len(G[v]) - neighbors_in_S
        if neighbors_in_S < neighbors_outside_S:
            return False
    return True

def parse_arguments():
    parser = argparse.ArgumentParser(description='Tenta encontrar uma aliança defensiva de tamanho k no grafo.')
    parser.add_argument('--graphFromFile', type=str, help='Lê o grafo do arquivo, pelo formato edgelist da biblioteca networkx. Não use junto com o --v ou --e.')
    parser.add_argument('--v', type=int,  default=50, help='Número de vertices ao gerar grafo aleatorio. Use juntamente o --e ou --d.')
    parser.add_argument('--d', type=float, default=5/100, help='Densidade do grafo. Gera um erdos_renyi_graph. Padrão 5/100. Precisa também do --v.')
    parser.add_argument('--e', type=int, help='Numero de arestas do grafo. Gera um gnm_random_graph. Precisa também do --v.')
    parser.add_argument('--k', type=int, default=5, help='Tamanho da aliança a ser buscada.')
    parser.add_argument('--seed', type=int, help='Seed ao gerar o grafo aleatório.')
    
    parser.add_argument('--debugSteps', action='store_true', help='Printa os passos de debug.')
    parser.add_argument('--extraResults', action='store_true', help='Printa alguns debugs extras.')
    parser.add_argument('--allowSmallerAlliances', action='store_true', help='Allow the algorithm to stops when finds a defensive alliance with size < k')
    parser.add_argument('--writeGraphToJson', type=str, help='Escreve o grafo no json especificado no formato lido pelo visualizador web.')
    parser.add_argument('--saveHistory', action='store_true', help='Permite gravar os passos no json de saída, caso exista. Tem um custo de memória alto.')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    debugSteps = args.debugSteps
    allowSmallerAlliances = args.allowSmallerAlliances
    saveHistory = args.saveHistory
    
    if args.graphFromFile:
        G = nx.read_edgelist(args.graphFromFile)
    else:
        if args.e:
            G = nx.gnm_random_graph(args.v, args.e, args.seed)
        else:
            G = nx.erdos_renyi_graph(args.v, args.d, args.seed)
        
    found, resultAlliance, steps = main(G, args.k)

    jsonResult = dict(nx.node_link_data(G))

    print(f'- Nós explorados: {explored_nodes}')
    if found:
        print(f'- Aliança defensiva de tamanho {len(resultAlliance)} encontrada: {resultAlliance}')
        print(f'- Conjunto S é validado como aliança: {is_defensive_alliance(G, resultAlliance)}')
        jsonResult["defensiveAlliances"] = [{
            "id": 0,
            "nodes": list(resultAlliance) if resultAlliance is not None else []
        }]
        

    else:
        print('Nenhuma aliança defensiva foi encontrada.')

    jsonResult["steps"] = [
        {"id": int(index), "values": list(step.items())} for index, step in enumerate(steps)
    ]
    
    if args.writeGraphToJson:
        with open(args.writeGraphToJson, 'w') as file:            
            file.write(json.dumps(jsonResult))
            
    if args.extraResults: 
        print(f'10 maiores valores de combinations > 1: {[f"{k}={v}" for k, v in sorted(combinations.items(), key=lambda x: x[1], reverse=True)[:10] if v > 1]}')
        print(f'Combinations ocupa {getsizeof(combinations) / (1024 * 1024):.2f} MB em memoria')
        print(f'Combinações repetidas puladas: {skippedNodes}')
        print(f'Graph density: {nx.density(G)}')
        print('histogram')
        for i, count in enumerate(nx.degree_histogram(G)):
            print(f'grau {i} = {count}')
    