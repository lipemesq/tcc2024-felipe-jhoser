
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

Algumas definições importantes
**Grafo (Graph)**: Um Grafo é uma estrutura composta por um conjunto de vértices V e um conjunto de arestas E que conectam pares de vértices. Formalmente, um grafo é representado como G=(V,E).
**Vértice (Vertex)**: Um elemento básico de um grafo que representa um ponto ou nó.
**Aresta (Edge or Link)**: Uma conexão entre dois vértices em um grafo, podendo ser direcionada ou não.
**Vizinhança de um Vértice (Neighborhood of a Vertex)**: O conjunto de todos os vértices adjacentes a um dado vértice v, denotado por N(v).
**Grau de um Vértice (Degree of a Vertex)**: O número de arestas incidentes a um vértice v. Em grafos não direcionados, é igual ao número de vizinhos de v.
**Subgrafo (Subgraph)**: Um grafo formado a partir de um subconjunto dos vértices e arestas de um grafo original.
	***Definir de maineira mais formal***
**Aliança em Grafos (Graph Alliance)**: Um subconjunto de vértices que satisfaz certas propriedades de vizinhança e conectividade, dependendo do tipo específico de aliança, as alianças podem ser classificadas em Defensiva, Ofensiva, Forte e Global .
**Aliança Defensiva (Defensive Alliance)**: Um subconjunto S \subseteq V tal que, para cada vértice v nE S, a seguinte condição é satisfeita:
	Colocar em notação matematica
	|N(v) \disjoint S| >= |N(v) \diference S|
Isso indica que os vertices v na aliança devem possuir pelo menos tantos vertices dentro da aliança quanto fora dela.
Outras definições a serem avaliadas
	**Conectividade**??
	**Algoritmos de Busca** DFS e BFS??	
	**Complexidade Computacional**
	**NP-Completude**
	**Demais notações utilizadas nas referências**

## Metodologia
	Apresentar o plano
		O que quisemos fazer
			Algoritmo em python
			Modificações
			Plataforma de visualizaçao em etapas
	Detalhes de Implementação
		Prints da visualização explicando o funcionamento?
		Modificações

Introdução
### Algoritmo em Python
A implementação do algoritmo proposto foi feita em python (apêndice 1). 
Foi utilizada a estrutura de dados da biblioteca _Networkx_.
Ocorre a busca.
Além do resultado final, possibilitamos o retorno da aliança em formato json, com as características utilizadas no projeto web de exibição. Essas características permitem a visualização passo a passo dos nós expandidos pelo algoritmo.

	Colocar como fazemos pra contar os passos (capturar S a toda iteração)
	Colocar as diferentes saídas do algoritmo

### Projeto web
O projeto web foi desenvolvido com Typescript em ambiente React.
O grafo é convertido a partir do json para uma estrutura de classes, e então usada em diversos parâmetros para decidir a cor dos vértices e das arestas, que mudam de acordo com a sua relação com a aliança encontrada.

	Elencar cada parâmetro relativo a aliança na exibição?
	Ex: 
		- Arestas: mudam de cor de acordo com a seguinte condição
			"Verde" se faz parte da aliança e a exibição está no último passo.
			"Cinza" se for entre vértices fora da aliança e não estiverem em S.
			"Vermelho" se estiver em S e antes do último passo.

## Resultado e discussão
	Mostrar os resultados de desempenho
	Mostrar a diferença das pequenas modificações

## Conclusão
	Discussão futura

## Referências
Pegar de [[Referências]]

## Apêndice

Código do algoritmo - v1
Código do algoritmo - com as modificações

