# Titulo
Felipe Mesquita, GRR20174479
Jhoser Allaf, GRR20166838

## Resumo
Este estudo explora o problema de encontrar alianças defensivas em grafos, um tema relevante na teoria dos grafos com aplicações em diversas áreas, desde análise de mercado, redes sociais e biologia. Definimos uma aliança defensiva como um subconjunto de vértices onde cada vértice possui pelo menos tantos vizinhos dentro do conjunto quanto fora dele, de forma a ter sempre mais "aliados" do que "inimigos". O texto se concentra na formulação do problema, na análise da complexidade computacional e na implementação de um algoritmo eficiente para a identificação dessas alianças.

Apresentamos um algoritmo FPT baseado em busca em profundidade, que explora sistematicamente os vértices do grafo para encontrar alianças defensivas de tamanho específico, e um visualizador web desenvolvido que permite a visualização passo a passo do processo de busca.

	Conclusão?

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

O estudo das alianças em grafos é um campo fascinante que combina conceitos de teoria dos grafos e complexidade computacional. As alianças, especialmente as alianças defensivas, são subconjuntos de vértices que garantem uma forma de defesa mútua entre seus membros; conceito este que pode ser aplicado deste alianças para suporte mútuo entre nações em guerra \[[[Artigo#^ref2 |2]]] até análise de estruturas da estrutura secundária do RNA \[[[Artigo#^ref2 |6]]].

Neste artigo, abordamos o problema de encontrar alianças defensivas em grafos, que pode ser formalizado como a identificação de subconjuntos de vértices que satisfazem condições específicas de conectividade e vizinhança. Um grafo $G = (V, E)$ é composto por um conjunto de vértices $V$ e um conjunto de arestas $E$. Uma aliança defensiva é definida como um subconjunto $S \subseteq V$ tal que, para cada vértice $v \in S$, o número de vizinhos de $v$ dentro de $S$ é pelo menos igual ao número de vizinhos de $v$ fora de $S$. Essa propriedade assegura que cada vértice na aliança possui mais aliados do que potenciais inimigos, promovendo assim a segurança do grupo.

A complexidade computacional associada à identificação de alianças defensivas é desanimadora, e fazemos dela o ponto central deste estudo. Através da perspectiva atenuante do algoritmo FPT de busca em profundidade proposto por \[[[Artigo#^ref1 |1]]], buscamos entender a eficiência e a viabilidade de encontrar tais alianças em grafos de diferentes tamanhos e estruturas.

Além disso, apresentamos um visualizador web que ilustra o funcionamento do algoritmo, permitindo uma compreensão mais intuitiva dos passos envolvidos na busca por alianças defensivas, e disponibilizamos em um repositório o algoritmo final e otimizado em *Python*. A seguir, detalharemos a fundamentação teórica necessária para a compreensão do tema, além de descrever a metodologia utilizada e os resultados obtidos.

## Fundamentação teórica
A fim de seguir de forma devida com a análise do problema e do algoritmo, algumas definições teóricas são requeridas:

#### Grafo
Um grafo $G = (V(G), E(G))$ é um par ordenado que consiste de um conjunto de vértices $V(G)$ e um conjunto de arestas $E(G)$. 
#### Vértice
Um vértice $v \in V(G)$ é um elemento básico de um grafo, representando um ponto ou nó na estrutura. O conjunto $V(G)$ é finito e contém todos os vértices do grafo.
#### Aresta
Uma aresta $e \in E(G)$ é um conjunto de dois vértices de $V(G)$. Em um grafo não direcionado, a aresta $\{u, v\}$ conecta os vértices $u$ e $v$, sem direção. Em grafos direcionados, uma aresta $(u, v)$ conecta $u$ a $v$ com uma orientação de $u$ para $v$.
#### Incidencia
As extremidades de uma aresta são ditas $incidentes$ com a aresta[7], e vice-versa, ou seja, uma aresta $e$ é dita incidente a um vertice $v$ se está aresta se conecta a $v$ em um de seus extremos.
#### Adjacência
Dois vértices que são incidentes a uma mesma aresta são adjacentes[7], assim como duas arestas que são incidentes a um mesmo vértice, ou seja, um par de vertices distintos $u$ e $v$ são adjacentes se possuem uma aresta que os conectam, da mesma forma que duas arestas distintas $e1$ e $e2$ são adjacentes se são incidentes a um vertice em comum.
#### Vizinhança de um Vértice
Dois vertices que são incidentes a uma aresta comum, ou seja, dois vértices adjacentes distintos são ditos vizinhos[7]. A vizinhança de um vértice $v \in V(G)$, denotada por $N(v)$, é o conjunto de todos os vértices adjacentes a $v$, ou seja, $N(v) = \{ u \in V(G) \mid \{u, v\} \in E(G) \}$ em grafos não direcionados.
#### Grau de um Vértice
O grau de um vértice $v$ em um grafo não direcionado $G$ é dado por $d_G(v) = |N(v)|$, ou seja, o número de arestas incidentes a $v$. Neste estudo consideramos apenas grafos não direcionados, portanto o grau de $v$ corresponde ao número de arestas total ligadas a ele.
#### Subgrafo
Um **subgrafo** de um grafo $G$ é um grafo $F$ cujos conjuntos de vértices e arestas são subconjuntos dos vértices e arestas de $G$. Formalmente, $F$ é um subgrafo de $G$ se $V(F) \subseteq V(G)$ e $E(F) \subseteq E(G)$, e a função que relaciona vértices e arestas em $F$ é a mesma que em $G$, mas restrita ao conjunto de arestas de $F$. Subgrafos podem ser formados a partir das operações de remoção de vértices e remoção de arestas.
Diz-se que $G$ contém $F$ ou que $F$ está contido em $G$, representado como $G \supseteq F$ ou $F \subseteq G$[7].
#### Conectividade
Um grafo é **conexo** se, para toda partição de seu conjunto de vértices em dois conjuntos não vazios $X$ e $Y$, existe uma aresta com uma extremidade em $X$ e a outra extremidade em $Y$, caso contrário, o grafo é desconexo. Em outras palavras, um grafo é desconexo se seu conjunto de vértices pode ser particionado em dois subconjuntos não vazios $X$ e $Y$ de modo que nenhuma aresta tenha uma extremidade em $X$ e outra em $Y$. 
#### Aliança Defensiva
Um subconjunto $S \subseteq V$ é uma aliança defensiva se, para cada vértice $v \in S$, a condição a seguir é satisfeita:   $|N(v) \cap S| \geq |N(v) \setminus S|$. 
Ou seja, para cada vértice $v$ na aliança $S$, o número de vértices adjacentes a $v$ dentro de $S$ deve ser pelo menos igual ao número de vértices adjacentes a $v$ fora de $S$. 
Isso indica que os vértices $v$ na aliança devem possuir pelo menos tantos vértices dentro da aliança quanto fora dela.
Para fins deste estudo, toda aliança encontrada deve ser **conexa**.  
#### Busca em Profundidade
A busca em profundidade é um algoritmo que varre um grafo de forma a evitar ciclos.  Construímos uma árvore adicionando, sempre que possível, um novo vértice a árvore $T$ que seja vizinho do vértice mais recentemente incluído na árvore. Basicamente, examinamos primeiro a lista de adjacência do último vértice adicionado, $x$, para encontrar um vizinho que ainda não esteja em $T$. Se encontrarmos esse vizinho, o adicionamos à árvore. Se não houver vizinhos disponíveis, retrocedemos (*backtrack*) para o vértice adicionado antes de $x$ e verificamos os seus vizinhos, e assim sucessivamente até que todos os vértices tenham sido completamente processados. 
Chamamos a árvore resultante desta busca de árvore de busca em profundidade ou *DFS-Tree*.
#### Complexidade Computacional
A complexidade computacional estuda a quantidade de recursos necessários para a execução de algoritmos, especialmente em termos de tempo e espaço. Em ciência da computação, a complexidade computacional é frequentemente representada usando a notação *Big O*, $O(f(n))$ que descreve o crescimento da complexidade em função do tamanho da entrada. Alguns exemplos de classificação de complexidade são:
  - $O(1)$: Constante, o tempo de execução não depende do tamanho da entrada.
  - $O(n)$: Linear, o tempo de execução cresce proporcionalmente ao tamanho da entrada.
  - $O(n^k)$: Polinomial, o tempo de execução cresce proporcionalmente com relação a potência $k$ constante do tamanho da entrada. Um exemplo de polinômio muito comum são os quadrados $O(n^2)$.
  - $O(k^n)$: Exponencial, o tempo de execução cresce de forma exponencial com relação ao tamanho da entrada. No geral, é inviável para grandes entradas.
  - $O(n!)$ Fatorial, em problemas fatoriais o tempo de execução cresce ainda mais acelerado com relação ao tamanho da entrada do que problemas exponenciais. 

##### Classes de Complexidade:
Os problemas de decisão, como os envolvendo alianças, podem ser classificados em certas classes de complexidade que separam o quão viáveis é encontrar ou verificar suas soluções para entradas de larga escala. Estas classes não:
  - $P$ (Polinomial): Representa a classe de problemas que podem ser resolvidos em tempo polinomial, ou seja, em $O(n^k)$ para algum inteiro $k$. Em ciência da computação, problemas em $P$ são considerados tratáveis.
- $NP$ (Tempo polinomial não determinístico): Representa a classe de problemas para os quais, apesar de não sabermos como encontrar solução em tempo polinomial de maneira determinística, dada uma solução, ela pode ser verificada em tempo polinomial por um algoritmo determinístico. Não sabemos se todo problema em $NP$ pode ser resolvido em tempo polinomial, isto é, se $P = NP$, e esse é um dos 7 problemas do milênio que ainda estão em aberto.
- $NP$-completo: Representa um subconjunto de problemas em $NP$ que são, intuitivamente, tão difíceis quanto qualquer outro problema em $NP$. Para um problema ser dessa classe, são necessárias duas características:    
	1. Estar em $NP$, ou seja, dada uma solução, ela deve ser verificável em tempo polinomial.
	2. Ser $NP$-difícil, todo problema em $NP$ pode ser redutível a ele em tempo polinomial.
  Em outras palavras, caso um problema de classe $NP$-completo seja resolvido em tempo polinomial, todos os outros problemas em $NP$ poderão ser resolvidos em tempo polinomial.
  
### O algoritmo
Antes de entrar na explicação minuciosa do algoritmo, é importante explicar o que é um algoritmo FPT. 
#### Complexidade
FPT é uma classe de complexidade que trata de problemas *superpolinomiais* (como exponenciais) ao isolar e fixar um parâmetro exponencial específico do problema, chamado $k$, e então transformando a complexidade na função $f(k)*p(n)$. Nesta transformação, $f(k)$ é a complexidade de $k$ e pode ser *superpolinomial*, enquanto $p(n)$ é a função polinomial de $n$. Desta forma, fixando $k$ em valores menores abordar o algoritmo de forma mais tratável, custando muito menos tempo, dependendo do tamanho de $k$.

O algoritmo usado neste estudo foi proposto por \[[[Artigo#^ref1 |1]]], e tem complexidade $O(k^kn)$, e é uma melhora de seu predecessor que tinha complexidade $O((2k - 1)^kk^2n)$.

	Incluir uma pequena tabela de valores com alguns (3 ou 4) tempos de algoritmos, como o trivial, o antigo, o novo e mais algum, com diferentes tamanhos de k e n.
#### Explicação
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
			
	Retorne "Sem aliança";
```

No início de `defensiveAlliance` o algoritmo escolhe o vértice de maior `c_w` em `S`,  que seria o vértice mais vulnerável da aliança. Esse vértice serve para tanto verificar se `S` se tornou uma aliança quanto como ponto de expansão a fim de incluir novos vértices.

A seguir, o algoritmo verifica se há espaço em `S` para os `c_w` vizinhos necessários serem adicionados, ou seja, para que `w` seja defendido dentro da restrição do tamanho máximo `k`. Essa verificação funciona de modo semelhante a uma heurística de busca, poupando tempo ao evitar vértices que não podem ser defendidos posteriormente.

A próxima parte é o que se pode ser chamado de núcleo do algoritmo: de acordo com o Lema 14 estabelecido por \[[[Artigo#^ref1 |1]]], é garantido que, se `S` pode ser expandido até se tornar uma aliança defensiva, então há um vértice no conjunto `W` que leva a esta solução. Assim, novamente o algoritmo poupa a exploração de vértices desnecessários. 

	Explicar brevemente o Lema 14
##### Lema 14 
Assuma que $S \subseteq V$ é estendivel para uma aliança defensiva S', onde $|S| <|S'| = k$ então, para qualquer vertice desprotegido $w \in S$, $|S' \cap (N[w] - S|) \ge c_w$[1].
Em outras palavras se $S$ é estendivel e $w$ é um vertice desprotegido de $S$ então $c_w$ é o número de vizinhos de $w$ fora de $S$ que é necessário para proteger $w$ em $S$.
Esse lema nós garante também que para qualquer subconjunto $W \subseteq N[w] - S$ com $t = \lfloor \frac{d_w}{2} \rfloor + 1$  vertices irão conter ao meno um vertice $w_i$, para o qual $S \cup {w_i}$ é estendivel se e somente se S é estendivel.

	Fazer uma estimação da complexidade em termos do numero de arestas COM e SEM o lance do T
#### Evitando repetir conjuntos
Por conta de como $S$ é construido, para cada $w$ em $S$ podemos avaliar até $k$ vertices desprotegidos para serem adicionados a $S$, isso nós leva a explorar no pior caso $k^k$  vertices a cada chamada da função $DefensiveAlliance(G,S,k)$ a partir da função $main(G,k)$.
Desta forma implementamos uma modificação onde nós guardamos todos os subconjuntos explorados de tamanho $1$ à $k$ de forma ordenada e antes de adicionar um novo conjunto verificamos se ele já não foi previamente visitado. Sabemos que isso nós leva a trocar um problema de tempo por outro de memória nós levando a armazenar no pior caso $\sum_{i=1}^{k} \binom{n}{i}$ subconjuntos.

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
\[1] [Alliances In Graphs: Parameterized Algorithms And On Partitioning Series-parallel Graphs](https://stars.library.ucf.edu/cgi/viewcontent.cgi?article=4995&context=etd) 
	Capítulo 4.1.1, "FPT-Algorithm for General Graphs". Este capítulo propõe um algoritmo FPT (Fixed-Parameter Tractable Algorithm) para busca de uma aliança defensiva em um grafo geral com tamanho máximo de K. A complexidade é de $O(k^kn)$. ^ref1

\[2] [P. Kristiansen, S.M. Hedetniemi, S.T. Hedetniemi, Alliances in graphs, J. Combin. Math. Combin. Comput. 48 (2004) 157–177.](http://refhub.elsevier.com/S0972-8600(16)30162-1/sb1)
	Referência a usar alianças defensivas pra guerra. ^ref2

\[3] [Partitioning A Graph In Alliances And Its Application To Data Clustering](https://stars.library.ucf.edu/cgi/viewcontent.cgi?article=1191&context=etd)
	 Capítulos 1-5, para aprendizado em geral de grafos e alianças. 

\[4] [Alliances in graphs: Parameters, properties and applications—A survey](https://www.sciencedirect.com/science/article/pii/S0972860016301621)
	Capítulo 1.1, história e aplicações de aliança. 

\[5] [react-force-graph](https://github.com/vasturiano/react-force-graph)
	Biblioteca reativa que implementa uma div (em HTML) que permite a visualização personalizada de um grafo em ambos 2D e 3D. ^

\[6] [T.W. Haynes, D. Knisley, E. Seier, Y. Zou, A quantitative analysis of secondary RNA structure using domination based parameters on trees, BMCBioinformatics 7 (108) (2006) 11.](http://refhub.elsevier.com/S0972-8600(16)30162-1/sb10)
	Uso de alianças defensivas para estudo das estruturas secundárias do RNA.

\[7]J.A. Bondy and U.S.R Murty. 2008. Graph Theory (3rd. ed.). Springer Publishing Company, Incorporated.
	

## Apêndice

Código do algoritmo - v1
Código do algoritmo - com as modificações
