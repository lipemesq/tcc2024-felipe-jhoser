Boa tarde, professores!

Meu nome é Felipe, e eu estarei apresentando junto ao Jhoser (da um oi) o nosso trabalho de conclusão de curso, orientado pelo professor Guedes, chamado Algoritmo FPT para alianças defensivas em grafos.

Nosso trabalho é centrado em conjuntos específicos de vértices que são chamados de alianças defensivas. Essas alianças tem uma propriedade muito legal, que faz jus ao nome maneiro, que é a de garantir que cada um de seus membros estará protegido pelos aliados caso seja atacados pelos vizinhos de fora dessa aliança.

Como assim? Vamos ver como são alianças na vida real. Tipicamente nos referimos a alianças no contexto militar, onde temos países que são vizinhos de outros países, e que se preocupam em atacar ou serem atacados por eles. Então eles formam alianças pra garantir que seu território não será invadido por um vizinho mal intencionado.

Como podem perceber, as conexões entre os países, que aqui serão os vértices, é a fronteira espacial com outros países, formando as arestas. Num grafo planar, como um mapa, isso é razoavelmente direto, mas o legal dos grafos é que podemos abstrair esse conceito de conexão pra, por exemplo, empresas que compram uma das outras, ou elementos que reagem entre si, seres vivos que dependem um dos outros, ou computadores que mandam informações.

E isso nos leva ao surgimento das alianças, que começaram a ser estudadas em 2004, por um pesquisador motivado pela relação de benefício mútuo entre países em guerra; em particular nas ações da OTAN (Organização do Tratado do Atlântico Norte), que é uma organização militar e em como ela poderia defender seus membros ou, hã, "ocupar pacificamente" um país para "garantir a paz".

Depois disso vários outros estudos surgiram, como esse que usa da sensibilidade à mudanças das alianças (que são afetadas por uma única aresta) para analisar o genoma nas estruturas do RNA.

Ou este que propõe um sistema auto estabilizador nas redes de computador, ou estes dois super interessantes que trazem a ideia de alianças entre empresas com Pesquisa e Desenvolvimento, e como elas podem se relacionar pra evoluir de forma benéfica; que então foi aplicado por outros pesquisadores, usando dados concretos, pra verificar quais empresas, e quais recursos, poderiam ser unidos pra se fortalecerem numa fatia de mercado.

Legal né? Até aqui tudo muito bom, muito maravilhoso, mas qual a pegadinha? Onde tá o problema? Bom...

NP-completo.

Isso dificulta vários estudos, como aquele sobre o RNA, que na conclusão afirma que não da pra continuar por conta das limitações computacionais.

Foi aí, meio receosos, que nos deparamos com o artigo primário deste trabalho, que é a nossa referência 1, que propõe um algoritmo FPT pra buscar alianças. Ele não foi o primeiro a propor isso, mas foi nele que descobrimos o que é o FPT, e, em especial, ele tem uma propriedade interessante na qual quebramos muito a cabeça tentando entender pra sacar como que ele conseguiu diminuir ainda mais a complexidade conquistada pelos seus antecessores.

[...]

Tentando entender como isso funcionava nós nos propusemos a criar um tipo de visualizador pra facilitar o entendimento.

(Mostra o visualizador de forma improvisada)

Olhando os logs e vendo como ele funcionava nós ficamos curiosos e resolvemos dar um passo além do que nos propusemos de início e ver se conseguíamos melhorar um pouco.

As nossas observações nos levaram a dois pontos em particular. O primeiro deles tem a ver com a expansão de S, e como ela *não é* uma busca em profundidade (detalhe importante que surgiu nas nossas conversas).

Esse detalhe apontou como ocorrem casos em que o algoritmo busca várias vezes a mesma sub-arvore, como aqui.

(Demonstrar a repetição de conjunto)

lalala