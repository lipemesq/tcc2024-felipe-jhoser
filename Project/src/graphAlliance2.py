import networkx as nx
import math

found = False  # Variável global para indicar se a aliança foi encontrada
resultado_S = set()  # Variável global para armazenar a aliança encontrada

def main(grafo, k):
    global found, resultado_S
    n = len(grafo.nodes)
    i = 0

    while not found and i < n:
        v_i = list(grafo.nodes)[i]
        S = {v_i}
        update_c_w(grafo, S)
        c_v_i = grafo.nodes[v_i]['c_w']
        print(f'Iniciando com vértice {v_i}, c_w = {c_v_i}')
        DA(grafo, S, k)
        i += 1

    if found:
        print(f'Aliança defensiva encontrada: {resultado_S}')
    else:
        print('Nenhuma aliança defensiva foi encontrada.')

def DA(grafo, S, k):
    global found, resultado_S
    if found:
        return

    # Atualiza c_w antes de selecionar w
    update_c_w(grafo, S)

    # Verifica se todos os vértices em S estão defendidos
    all_defended = all(grafo.nodes[v]['c_w'] <= 0 for v in S)

    if all_defended and len(S) >= k:
        found = True
        resultado_S = S.copy()
        print(f'Aliança defensiva de tamanho {len(S)} encontrada: {S}')
        return

    if len(S) >= k:
        # Não podemos adicionar mais vértices, mas nem todos estão defendidos
        return

    # Seleciona w em S que tem o maior valor de c_w
    w = max(S, key=lambda v: grafo.nodes[v]['c_w'])
    c_w = grafo.nodes[w]['c_w']

    print(f'Analisando vértice {w} com c_w = {c_w} e |S| = {len(S)}')

    # Verificar se podemos expandir S
    if c_w <= k - len(S):
        d_w = grafo.degree[w]
        t = math.ceil(d_w / 2) + 1

        # Obter W
        W = sorted(
            [v for v in grafo.neighbors(w) if v not in S],
            key=lambda v: math.floor((grafo.degree[v] + 1) / 2)
        )

        print(f'Expandindo vizinhos de {w}, até {t} vizinhos podem ser adicionados.')

        i = 0
        while not found and i < len(W):
            w_i = W[i]
            i += 1

            # Salvar o estado atual
            S_prev = S.copy()
            c_w_backup = {v: grafo.nodes[v].get('c_w', None) for v in grafo.nodes}

            S.add(w_i)
            print(f'Adicionando vértice {w_i} à aliança {S}')
            update_c_w(grafo, S)

            DA(grafo, S, k)

            if not found:
                # Restaurar o estado
                S = S_prev
                for v in grafo.nodes:
                    if c_w_backup[v] is not None:
                        grafo.nodes[v]['c_w'] = c_w_backup[v]
                    else:
                        grafo.nodes[v].pop('c_w', None)
                print(f'Removendo vértice {w_i} de {S}, recalculando c_w.')
            else:
                return  # Se found é True, não precisamos continuar
    else:
        # Não é possível expandir S para obter uma aliança defensiva de tamanho k
        return

def update_c_w(grafo, S):
    for v in S:
        grau_v = grafo.degree[v]
        required_neighbors = math.floor((grau_v + 1) / 2)
        neighbors_in_S = set(grafo.neighbors(v)) & S
        num_neighbors_in_S = len(neighbors_in_S)
        c_v = required_neighbors - num_neighbors_in_S
        grafo.nodes[v]['c_w'] = c_v
        print(f'Atualizando vértice {v}, novo c_w = {c_v}, vizinhos em S (incluindo v): {num_neighbors_in_S}, requerido: {required_neighbors}')

def read_graph(json_data):
    G = nx.Graph()

    for node in json_data['nodes']:
        G.add_node(node['id'])

    for link in json_data['links']:
        G.add_edge(link['source'], link['target'])

    return G

if __name__ == "__main__":
    json_grafo = {
        "nodes": [{"id": i} for i in range(15)],
        "links": [
            {"source": 0, "target": 3},
            {"source": 0, "target": 2},
            {"source": 0, "target": 9},
            {"source": 0, "target": 7},
            {"source": 1, "target": 8},
            {"source": 1, "target": 14},
            {"source": 1, "target": 3},
            {"source": 1, "target": 9},
            {"source": 2, "target": 7},
            {"source": 3, "target": 12},
            {"source": 3, "target": 10},
            {"source": 3, "target": 14},
            {"source": 4, "target": 12},
            {"source": 4, "target": 10},
            {"source": 5, "target": 13},
            {"source": 5, "target": 12},
            {"source": 5, "target": 9},
            {"source": 5, "target": 7},
            {"source": 6, "target": 9},
            {"source": 6, "target": 14},
            {"source": 6, "target": 7},
            {"source": 7, "target": 8},
            {"source": 7, "target": 10},
            {"source": 8, "target": 11},
            {"source": 10, "target": 11},
            {"source": 10, "target": 14},
            {"source": 10, "target": 13},
            {"source": 10, "target": 12},
            {"source": 11, "target": 12},
            {"source": 13, "target": 14}
        ]
    }

    G = read_graph(json_grafo)
    k = 5
    main(G, k)
