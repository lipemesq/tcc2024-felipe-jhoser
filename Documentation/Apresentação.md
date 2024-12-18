#### Introdução (6min)
1. Apresentações
	1. Nossos nomes
	2. Nome do trabalho
2. "Nosso trabalho é focado em conjuntos específicos de vértices num grafo que são chamados de alianças defensivas. Essas alianças tem uma propriedade muito legal, o que faz jus ao nome maneiro, que é a de garantir que cada um de seus membros estará protegido pelos aliados caso seja atacados pelos vizinhos de fora dessa aliança."
	5. Imagens de fundo ilustrando alianças de guerra e alianças em grafos.
	6. Usar imagens da wikipedia.
5. Introduzir brevemente a origem do termo [3] e explicar a definição.
6. Apresentar algumas aplicações.
	1. Usar as do artigo que citamos nas referências [3].
7. "Dito isso, problemas de busca de alianças foram provados serem NP-completos. [...]. Nos deparamos com este artigo que propõe um algoritmo FPT pra tentar viabilizar esse problema."
8. . "Ele não é foi o primeiro, mas achamos interessante porque, 1, não conhecíamos a classe/abordagem FPT, e 2, porque ele usa de uma propriedade especial que permitiu diminuir ainda mais a complexidade estipulada pelos seus antecessores."

#### O processo e o visualizador (8 min falando + 6 min demonstrando)
1. Explicar em 10 segundos como funciona o FPT.
2. Explicar o código.
	1. Sem demonstrar com o visualizador ainda, só palavras e código.
3. Explicar o lema 14 que causou a melhora.
	1. No histórico deste artigo temos a primeira abordagem FPT que tinha $O((2k-1)^k k^2n)$, que então passa por uma melhora exponencial para $O(k^kn)$. 
4. "Tentando entender como isso funcionava nós nos propusemos a criar um tipo de visualizador pra facilitar o entendimento."
	1. Explicar que programamos o código e fizemos o visualizador.
5. Demonstrar o visualizador ao vivo com alguns grafos interessantes.
	1. Explicar como fizemos, mas sem muito detalhe pra tecnologia; focar na utilidade dele e no processo.
	2. Usar dois grafos pequenos: um uniforme e outro esparso.
	3. Mostrar dois grafos maiores, e agora incluir o 3D.
6. "Olhando os logs e vendo como ele funcionava nós ficamos curiosos e resolvemos dar um passo além do que nos propusemos de início e ver se conseguíamos melhorar um pouco."

#### As melhorias (9 min falando + 6 min demonstrando)
1. "As nossas observações nos levaram a dois pontos em particular. O primeiro deles tem a ver com a expansão de S, e como ela *não é* uma busca em profundidade (detalhe importante que surgiu nas nossas conversas)."
2. Mostrar um grafo que repita o mesmo subconjunto.
3. "Como melhorar isso?"
	1. Elencar as nossas tentativas iniciais: ordenar os vértices, guardar os antepassados nos nós etc.
4. Falar sobre a ideia de trocar tempo por espaço, a alteração no código e a complexidade de tempo e espaço gastos.
7. "A segunda melhoria tem a ver com o critério de escolha ao expandir S. O lema 14 estabelece que podemos pegar um conjunto aleatório, desde que o tamanho esteja correto, mas a gente pode fazer melhor que 'aleatório'?"
8. Explicar o critério de escolha, a alteração no código e a complexidade de tempo.
9. Mostrar duas execuções lado a lado.
10. Mostrar os dois gráficos e falar do impacto.
11. Falar da região crítica.

#### Considerações finais?
1. Citar ao fim que é possível evitar a busca em certos grafos se seguirmos a lista de limites que alguns estudos introduzem.