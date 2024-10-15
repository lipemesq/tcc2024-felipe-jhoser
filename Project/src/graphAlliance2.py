import networkx as nx
import math

def main(grafo, k):
    n = len(grafo.nodes)
    i = 0
    found = False

    while not found and i < n:
        v_i = list(grafo.nodes)[i]
        S = {v_i}
        update(grafo, S)
        c_v_i = grafo.nodes[v_i]['c_w']
        print(f'Iniciando com vértice {v_i}, c_w = {c_v_i}')
        found, resultado_S = DA(grafo, S, k)
        i += 1

    if found:
        print(f'Aliança defensiva encontrada: {resultado_S}')
        print(f'Conjunto S é aliança: {is_defensive_alliance(grafo, resultado_S)}')
    else:
        print('Nenhuma aliança defensiva foi encontrada.')

def DA(grafo, S, k):
    # Seleciona w em S que tem o maior valor de c_w
    w = max(S, key=lambda v: grafo.nodes[v]['c_w'])
    c_w = grafo.nodes[w]['c_w']

    if c_w <= 0 and len(S) == k:
        # Todos os vértices em S estão defendidos
        print(f'Aliança defensiva de tamanho {len(S)} encontrada: {S}')
        return True, S.copy()

    print(f'Analisando vértice {w} com c_w = {c_w} e |S| = {len(S)}')

    if c_w <= k - len(S):
        d_w = grafo.degree[w]
        t = math.ceil(d_w / 2) + 1

        W = [v for v in grafo.neighbors(w) if v not in S]

        # Tenta expandir S adicionando cada vizinho de w que não está em S
        i = 0
        found = False
        while not found and i < min(t, len(W)):
            w_i = W[i]
            S.add(w_i)
            print(f'Adicionando vértice {w_i} à aliança {S}')
            update(grafo, S)

            found, resultado_S = DA(grafo, S, k)

            if not found:
                print(f'Removendo vértice {w_i} de {S}, recalculando c_w.')
                S.remove(w_i)
                update(grafo, S)
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
        Nv = set(grafo.neighbors(v))
        n_vizinhos = grafo.degree[v]
        required_neighbors = math.ceil(n_vizinhos / 2)
        Nv_in_S = Nv & S
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

G = nx.read_edgelist("public/inputs/7.in")  # Ler diretamente do arquivo
k = 5
r = main(G, k)

showJson = True

if (showJson):
    print("\n", nx.node_link_data(G, edges="links"))

else:
    print(r)
    

# testar inputs em https://csacademy.com/app/graph_editor/
# inputs, testados com tamanho k=5: 
# k5 tem alianças de tamanho 4 e 5, iniciando do 0
# 6.in e 7.in tbm
