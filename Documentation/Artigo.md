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

Algumas definições importantes são:
#### Grafo (Graph)
Um grafo $G = (V(G), E(G))$ é um par ordenado que consiste de um conjunto de vértices $V(G)$ e um conjunto de arestas $E(G)$, junto com um função de incidencia $\psi G$ que para cada aresta de $G$ um par não ordenado de vertices de $G$. Se $e$ é uma aresta e $u$ e $v$ são vértices tais que $\psi G(e)=\{u,v\}$, então diz-se que $e$ conecta $u$ e $v$, e os vértices $u$ e $v$ são chamados de extremos de $e$. 
#### Vértice (Vertex)
Um vértice $v \in V(G)$ é um elemento básico de um grafo, representando um ponto ou nó na estrutura. O conjunto $V(G)$ é finito e contém todos os vértices do grafo.

#### Aresta (Edge)
Uma aresta $e \in E(G)$ é uma conexão entre dois vértices de $V(G)$. Em um grafo não direcionado, a aresta $\{u, v\}$ conecta os vértices $u$ e $v$, sem direção. Em grafos direcionados, uma aresta $(u, v)$ conecta $u$ a $v$ com uma orientação de $u$ para $v$.

#### Vizinhança de um Vértice (Neighborhood of a Vertex)
Duas arestas que são incidentes a um vértice comum e dois vértices adjacentes distintos são ditos vizinhos. A vizinhança de um vértice $v \in V(G)$, denotada por $N(v)$, é o conjunto de todos os vértices adjacentes a $v$, ou seja, $N(v) = \{ u \in V(G) \mid \{u, v\} \in E(G) \}$ em grafos não direcionados.
#### Grau de um Vértice (Degree of a Vertex)
O grau de um vértice $v$ em um grafo não direcionado $G$ é dado por $d G(v) = |N(v)|$, ou seja, o número de arestas incidentes a $v$. 
 
#### Subgrafo (Subgraph)
Um **subgrafo** de um grafo $G$ é um grafo $F$ cujos conjuntos de vértices e arestas são subconjuntos dos vértices e arestas de $G$. Formalmente, $F$ é um subgrafo de $G$ se $V(F) \subseteq V(G)$ e $E(F) \subseteq E(G)$, e a função que relaciona vértices e arestas em $F$ é a mesma que em $G$, mas restrita ao conjunto de arestas de $F$. Subgrafos podem ser formados a partir das operações de remoção de vertices e remoção de arestas.
Diz-se que $G$ contém $F$ ou que $F$ está contido em $G$, representado como $G \supseteq F$ ou $F \subseteq G$.


#### Aliança em Grafos (Graph Alliance)
Em um grafo $G = (V, E)$, uma aliança é um subconjunto de vértices $S \subseteq V$ que satisfaz propriedades específicas de vizinhança e conectividade. As alianças podem ser classificadas de acordo com suas condições, como alianças defensivas, ofensivas, fortes ou globais.

#### Aliança Defensiva (Defensive Alliance)
Um subconjunto $S \subseteq V$ é uma aliança defensiva se, para cada vértice $v \in S$, a condição a seguir é satisfeita:   $|N(v) \cap S| \geq |N(v) \setminus S|$. 
  Ou seja, para cada vértice $v$ na aliança $S$, o número de vértices adjacentes a $v$ dentro de $S$ deve ser pelo menos igual ao número de vértices adjacentes a $v$ fora de $S$. 
  Isso indica que os vertices $v$ na aliança devem possuir pelo menos tantos vertices dentro da aliança quanto fora dela.
#### Conectividade
Um grafo é conexo se, para toda partição de seu conjunto de vértices em dois conjuntos não vazios $X$ e $Y$, existe uma aresta com uma extremidade em $X$ e a outra extremidade em $Y$, caso contrário, o grafo é desconexo. Em outras palavras, um grafo é desconexo se seu conjunto de vértices pode ser particionado em dois subconjuntos não vazios $X$ e $Y$ de modo que nenhuma aresta tenha uma extremidade em $X$ e outra em $Y$. 
  (Uma observação importante é que devido as caracteriscas de busca em profundidade contidas no algoritmo implementado as alianças encontradas serão sempre conexas).
#### Busca em Profundidade(Depth-First Search -DFS)
Em um algoritmo de busca em profundidade, construímos uma árvore adicionando, sempre que possível, um novo vértice a árvore $T$ que seja vizinho do vértice mais recentemente incluído na árvore. Basicamente, examinamos primeiro a lista de adjacência do último vértice adicionado, $x$, para encontrar um vizinho que ainda não esteja em $T$. Se encontrarmos esse vizinho, o adicionamos à árvore. Se não houver vizinhos disponíveis, retrocedemos (backtrack) para o vértice adicionado antes de $x$ e verificamos os seus vizinhos, e assim sucessivamente até que todos os vertices tenham sido completamente processados. 
  Chamamos a árvore resultante desta busca de árvore de busca em profundidade ou $DFS-Tree$.

#### Complexidade Computacional
A complexidade computacional estuda a quantidade de recursos necessários para a execução de algoritmos, especialmente em termos de tempo e espaço. Em ciência da computação, a complexidade computacional é frequentemente representada usando a notação Big O, $O(f(n))$ que descreve o crescimento da complexidade em função do tamanho da entrada .Alguns exemplos de classificação de complexidade são:
  - $O(1)$: Constante, o tempo de execução não depende do tamanho da entrada.
  - $O(n)$: Linear, o tempo de execução cresce proporcionalmente ao tamanho da entrada.
  - $O(n^k)$: Polinomial, o tempo de execução cresce proporcionalmente com relação a potência $k$ constante do tamanho da entrada. Um exemplo de polinomio muito comum são os quadrados $O(n^2)$.
  - $O(k^n)$: Exponecial, o tempo de execução cresce de forma exponencial com relação ao tamanho da entrada, No geral é inviável para grandes entradas.
  - $O(n!)$ Fatorial, em problemas fatoriais o tempo de execução cresce ainda mais acelerado com relação ao tamanho da entrada do que problemas exponenciais. 

	colocar melhor como texto
- Classes de Complexidade:
  $P$ (Polinomial): Representa a classe de problemas que podem ser resolvidos em tempo polinomial, ou seja, em $O(n^k)$ para algum inteiro $k$. Em ciência da computação, problemas em $P$ são considerados tratáveis.

- $NP$ (não determinístico polinomial): Representa a classe de problemas para os quais, apesar de não sabermos como encontrar solução em tempo polinomial de maneira determinística, dada uma solução, ela pode ser verificada em tempo polinomial por um algoritmo determinístico. Não sabemos se todo problema em $NP$ pode ser resolvido em tempo polinomial, isto é, se $P = NP$, e esse é um dos 7 problemas do milênio que ainda estão em aberto.
    
- $NP$-completo: Representa um subconjunto de problemas em $NP$ que são, intuitivamente, tão difíceis quanto qualquer outro problema em $NP$. Para um problema ser dessa classe, são necessárias duas características:    
    1- Estar em $NP$, ou seja, dada uma solução, ela deve ser verificável em tempo polinomial.
    2- Ser $NP$-difícil, todo problema em $NP$ pode ser redutível a ele em tempo polinomial.
  Em outras palavras, caso um problema de classe $NP$-completo seja resolvido em tempo polinomial, todos os outros problemas em $NP$ poderão ser resolvidos em tempo polinomial.

**Demais notações utilizadas nas referências** - Pendente
	Não precisa delas
### O algoritmo
	Explicar o algoritmo do artigo
Usar [[Conhecimentos]].
O algoritmo é dividido em duas funções principais, a `main` e a `defensiveAlliance`. A `main` recebe como entrada um Grafo $G$ e um inteiro positivo $k$. De forma intuitiva, a proposta do algoritmo é realizar buscas em profundidade $k$ até encontrar uma aliança defensiva de tamanho $k$ ou todos os vértices terem servido de raiz da busca.

```
Main(G,k)
	Para cada vértice v de G:
		inicia uma aliança S <- {v}.
		Update(G, S).
		aliança_encontrada <- DefensiveAlliance(S).
		Se aliança_encontrada:
			retorne aliança_encontrada.
			
	retorne "Sem aliança";
```

O papel da função `main` é garantir que todos os vértices foram usados como raiz da busca em profundidade. Para isso, primeiro é chamada a função auxiliar `update` que atualiza  o estado de `c_w` de todos os vértices _possível aliança_ `S`.

```
Update(G, S)
	Para cada vértice v de S:
		v.c_w <- número de vizinhos que v precisa em S para estar defendido.
```

A variável `c_w` serve para verificar se o vértice está protegido dentro da aliança `S`, e isso faz parte da condição de sucesso da busca, ou seja, quando todos os vértices de `S` estiverem protegidos -- `c_w <= 0` -- então uma aliança defensiva foi formada.

A seguir, a `main` chama a função `defensiveAlliance` para verificar se `S` é, ou pode ser expandida até, uma aliança defensiva de tamanho `k`. 

```
DefensiveAlliance(G, S, k)
	inicia v <- vértice de maior c_w em S.
	Se v.c_w <= 0 e tamanho de S == k:
		devolve S.
		
	Se v.c_w <= k - tamanho de S: 
		inicia t <- 1 + metade dos vizinhos de w.
		inicia o conjunto W <- t vizinhos de w que não pertencem a S.
		Para cada vértice w em W:
			S <- S + w.
			Update(G, S).
			aliança_encontrada <- DefensiveAlliance(G, S, k)
			Se aliança_encontrada:
				Devolve aliança_encontrada.
			Retira w de S.
			
	Devolve "Sem aliança";
```

No início de `defensiveAlliance` o algoritmo escolhe o vértice de maior `c_w` em `S`,  que seria o vértice mais vulnerável da aliança. Esse vértice serve para tanto verificar se `S` se tornou uma aliança quanto como ponto de expansão a fim de incluir novos vértices.

A seguir, o algoritmo verifica se há espaço em `S` para os `c_w` vizinhos necessários serem adicionados, ou seja, para que `w` seja defendido dentro da restrição do tamanho máximo `k`. Essa verificação funciona de modo semelhante a uma heurística de busca, poupando tempo ao evitar vértices que não podem ser defendidos posteriormente.

A próxima parte é o que se pode ser chamado de núcleo do algoritmo: de acordo com o lema estabelecido por [autor], é garantido que, se `S` pode ser expandido até se tornar uma aliança defensiva, então há um vértice no conjunto `W` que leva a esta solução. Assim, novamente o algoritmo poupa a exploração de vértices desnecessários. 

	Fazer uma estimação da complexidade em termos do numero de arestas COM e SEM o lance do T
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
