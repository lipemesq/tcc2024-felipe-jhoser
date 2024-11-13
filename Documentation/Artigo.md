
# Titulo
Felipe Mesquita, GRR20174479
Jhoser Allaf, GRR20166838

## Resumo
	Resumo em português (e inglês?)
	Leve introdução a alianças, suas aplicações e complexidade
	Objetivo
	O que fizemos
	O que obtivemos de resultado

## Sumário
```table-of-contents
title: 
style: nestedList # TOC style (nestedList|nestedOrderedList|inlineFirstLevel)
minLevel: 2 # Include headings from the specified level
maxLevel: 0 # Include headings up to the specified level
includeLinks: true # Make headings clickable
debugInConsole: false # Print debug info in Obsidian console
```

## Introdução
	Apresentar o contexto de alianças
		Definição amigável
		Definição matemática? 
		Data de definição?
		
	Justificar nosso tema
		Aplicações de aliança (pegar o [3] de [[Referências]])
		Complexidade base e as melhoradas
		
	Definir objetivo principal + objetivos específicos

## Fundamentação teórica
	Apresentar conceitos básicos de grafos?
		tipos
		propriedades
	Definir o que são alianças defensivas
	Apresentar o algoritmo e explicar funcionamento

O problema de encontrar alianças defensivas em grafos pode ser formalizado como a identificação de subconjuntos de vértices que satisfazem certas propriedades de defesa mútua. Um grafo $G=(V,E)$ é composto por um conjunto de vértices $V$ e um conjunto de arestas $E$. Uma aliança defensiva é um subconjunto $S \subseteq V$ tal que, para cada vértice $v \in S$, o número de vizinhos de $v$ dentro de $S$ é pelo menos igual ao número de vizinhos de $v$ fora de $S$, garantindo que $v$ tem mais vértices "aliados" do que "possíveis inimigos".

Algumas definições importantes
# Definições Formais de Conceitos em Grafos

## Grafo (Graph)
- Um grafo $G = (V, E)$ é uma estrutura composta por um conjunto de vértices $V$ e um conjunto de arestas $E$, onde $E \subseteq \{ \{u, v\} \mid u, v \in V \}$ em grafos não direcionados, e $E \subseteq \{ (u, v) \mid u, v \in V \}$ em grafos direcionados. Cada aresta conecta um par de vértices, podendo ter orientação (grafos direcionados) ou não (grafos não direcionados).

## Vértice (Vertex)
- Um vértice $v \in V$ é um elemento básico de um grafo, representando um ponto ou nó na estrutura. O conjunto $V$ é finito e contém todos os vértices do grafo.

## Aresta (Edge)
- Uma aresta $e \in E$ é uma conexão entre dois vértices de $V$. Em um grafo não direcionado, a aresta $\{u, v\}$ conecta os vértices $u$ e $v$, sem direção. Em grafos direcionados, uma aresta $(u, v)$ conecta $u$ a $v$ com uma orientação de $u$ para $v$.

## Vizinhança de um Vértice (Neighborhood of a Vertex)
- A vizinhança de um vértice $v \in V$, denotada por $N(v)$, é o conjunto de todos os vértices adjacentes a $v$, ou seja, $N(v) = \{ u \in V \mid \{u, v\} \in E \}$ em grafos não direcionados.

## Grau de um Vértice (Degree of a Vertex)
- O grau de um vértice $v \in V$ em um grafo não direcionado é dado por $\deg(v) = |N(v)|$, ou seja, o número de arestas incidentes a $v$. 
 
## Subgrafo (Subgraph)
- Seja $G = (V, E)$ um grafo. Um subgrafo de $G$ é um grafo $G' = (V', E')$ tal que $V' \subseteq V$ e $E' \subseteq E \cap \{ \{u, v\} \mid u, v \in V' \}$ para grafos não direcionados, e $E' \subseteq E \cap \{ (u, v) \mid u, v \in V' \}$ para grafos direcionados.

## Aliança em Grafos (Graph Alliance)
- Em um grafo $G = (V, E)$, uma aliança é um subconjunto de vértices $S \subseteq V$ que satisfaz propriedades específicas de vizinhança e conectividade. As alianças podem ser classificadas de acordo com suas condições, como alianças defensivas, ofensivas, fortes ou globais.

## Aliança Defensiva (Defensive Alliance)

- Um subconjunto $S \subseteq V$ é uma aliança defensiva se, para cada vértice $v \in S$, a condição a seguir é satisfeita:   $|N(v) \cap S| \geq |N(v) \setminus S|$. 
  Ou seja, para cada vértice $v$ na aliança $S$, o número de vértices adjacentes a $v$ dentro de $S$ deve ser pelo menos igual ao número de vértices adjacentes a $v$ fora de $S$. 
  Isso indica que os vertices $v$ na aliança devem possuir pelo menos tantos vertices dentro da aliança quanto fora dela.
## Conectividade

- **Conectividade de um Grafo**: Em um grafo $G = (V, E)$, a conectividade descreve a propriedade que determina se todos os pares de vértices estão ligados por caminhos. Existem dois principais tipos de conectividade:
  - **Conectividade de Vértice (Vertex Connectivity)**: É o número mínimo de vértices que devem ser removidos para desconectar o grafo. Formalmente, a conectividade de vértices de um grafo $G$, denotada por $\kappa(G)$, é o menor número de vértices que, ao serem removidos, dividem o grafo em componentes desconectados.
  - **Conectividade de Aresta (Edge Connectivity)**: É o número mínimo de arestas que precisam ser removidas para desconectar o grafo. Denotamos a conectividade de arestas de $G$ como $\lambda(G)$, sendo o menor número de arestas que, ao serem removidas, deixam o grafo desconectado.

- **Componentes Conexas**: Em um grafo não direcionado, um **componente conexo** é um subgrafo no qual qualquer par de vértices está conectado por um caminho. Se um grafo inteiro for conexo, ele contém apenas um componente conexo.

## Algoritmos de Busca

- **Algoritmo de Busca em Largura (Breadth-First Search - BFS)**: É um algoritmo de busca em grafos que explora os vértices em camadas, ou seja, explora todos os vizinhos de um vértice antes de avançar para os vizinhos dos vizinhos. Em um grafo $G = (V, E)$, BFS começa em um vértice inicial $s \in V$ e visita todos os vértices que estão a uma distância de $d = 1$ de $s$, depois $d = 2$, e assim por diante. Este algoritmo é útil para encontrar o caminho mais curto em grafos não ponderados.

- **Algoritmo de Busca em Profundidade (Depth-First Search - DFS)**: Um algoritmo de busca que explora o grafo o mais profundamente possível ao longo de cada ramo antes de retroceder. Em um grafo  $G = (V, E)$, a DFS começa em um vértice inicial $s \in V$ e explora cada caminho a partir de $s$ até chegar a um vértice sem vizinhos inexplorados, momento em que retrocede e explora novos caminhos. A DFS é útil para detectar ciclos, encontrar componentes fortemente conexas e ordens topológicas.

## Complexidade Computacional

- **Complexidade Computacional**: Estuda a quantidade de recursos necessários para a execução de algoritmos, especialmente em termos de tempo e espaço. Em ciência da computação , a complexidade computacional é frequentemente representada usando a notação Big O $O(f(n))$, que descreve o crescimento da complexidade em função do tamanho da entrada $n$.

- ** Alguns exemplos de classificação de Complexidade**:
  - **Constante** $O(1)$: O tempo de execução não depende do tamanho da entrada.
  - **Logarítmica** $O$($log$ $n$): O tempo de execução cresce de forma logarítmica em relação ao tamanho da entrada.
  - **Linear** $O(n)$: O tempo de execução cresce proporcionalmente ao tamanho da entrada.
  - **Quadrática** $O(n^2)$: O tempo de execução cresce proporcionalmente ao quadrado do tamanho da entrada.
  - **Exponencial** $O(2^n)$: O tempo de execução cresce de forma exponencial com o tamanho da entrada, geralmente inviável para grandes entradas.

- **Classes de Complexidade**:
  - **P**: A classe de problemas que podem ser resolvidos em tempo polinomial, ou seja, em $O(n^k)$ para algum inteiro $k$. Problemas em **P** são considerados tratáveis.
  - **NP**: A classe de problemas para os quais uma solução pode ser verificada em tempo polinomial. Não se sabe se todo problema em **NP** pode ser resolvido em tempo polinomial (isto é, se **P = NP**).
  - **NP-completo**: Problemas em **NP** que são, intuitivamente, tão difíceis quanto qualquer outro problema em **NP**. Se algum problema **NP-completo** puder ser resolvido em tempo polinomial, então todos os problemas em **NP** também poderão.

**Demais notações utilizadas nas referências** - Pendente

### O algoritmo
	Explicar o algoritmo do artigo
Usar [[Conhecimentos]].

#### Evitando repetir conjuntos
	Explicar a pequena modificação que evita repetir conjuntos
## Metodologia
O projeto é composto por duas partes principais: algoritmos de busca implementados em Python e um visualizador web criado para exibir os passos deste algoritmo. As partes funcionam de forma independente, sendo conectadas apenas pelo formato de entrada e saída dos programas.
### Algoritmo em Python
A implementação do algoritmo proposto por [1] foi feita em Python e consta completa no Apêndice 1.

Nesta implementação foi utilizada a estrutura de dados da biblioteca _Networkx_ para manipulação dos grafos, e, no mais, estruturada de forma semelhante ao algoritmo teórico, com a exceção do uso de uma estrutura de pilha para substituir a chamada recursiva.

Além do resultado final, o programa possibilita o retorno da aliança em formato JSON, com as características utilizadas no visualizador web. Essas características permitem a visualização passo a passo dos nós expandidos pelo algoritmo, e consistem do conjunto $W$ a cada iteração da função `DefensiveAlliance`.

	E o que mais?
	Colocar as diferentes saídas do algoritmo como exemplo

### Visualizador web
O projeto web foi desenvolvido com Typescript e React, e sua proposta é fornecer uma visualização passo-a-passo do algoritmo e do grafo de entrada. Assim como o algoritmo de busca, o visualizador pode ser encontrado no repositório que se encontra nas referências.

Para montar a visualização é necessário que seja fornecido como entrada um grafo disposto em formato JSON, contando com dois conjuntos extras de dados que são a aliança encontrada, caso exista, e um vetor de *steps*, que contém o conjunto $W$ no dado *passo* da iteração. 

Munido destas informações, o visualizador organiza os dados internamente para melhorar o desempenho e a decisão de cada caraterística visual do grafo e então personaliza uma *view* HTML, dada pela biblioteca [3], que cuida da renderização e simulação física do grafo.

As especificações detalhadas a respeito do uso e características do visualizador estão na documentação do repositório.

## Resultado e discussão
	Mostrar os resultados de desempenho
	Mostrar a diferença das pequenas modificações
O algoritmo foi avaliado com base em dois critérios, o número de nós expandidos e o número de passos (inclusões e remoções de $S$) executados.
Realizamos experimentos com as seguintes instâncias de grafos:

| Grafo           | Nós expandidos | Passos executados |
| --------------- | -------------- | ----------------- |
| $K_{3,3}$       |                |                   |
| $K_{5,5}$       |                |                   |
| Grafo bipartido |                |                   |
|                 |                |                   |
|                 |                |                   |

## Conclusão
	Discussão futura

## Referências
Pegar de [[Referências]]

## Apêndice

Código do algoritmo - v1
Código do algoritmo - com as modificações

