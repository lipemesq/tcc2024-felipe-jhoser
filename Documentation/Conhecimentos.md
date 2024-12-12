	$N[w]$
	Vizinhança fechada de $w$ no grafo, incluindo o próprio $w$.

	$d_w​$
	Grau do vértice $w$ em $G$.

	$c_w$
	Número de vizinhos de $w$ que precisam ser adicionados a $S$ para que $w$ fique protegido.

	A generalização de aliança defensiva, ofensiva e poderosa são as k-alianças,
	onde k é a "diferença de poder" entre a aliança e a vizinhança externa. 

	
#### Algoritmo FPT de aliança defensiva

Passa de vértice em vértice e tenta expandi-lo em uma aliança defensiva de tamanho $k$. Se der, devolve a aliança.

##### $Main$
	Passa todos os vértices, para o vértice w:
		Inicia uma aliança S somente com w.
		Inicia c_w como sendo metade do grau de w (ou seja: 
		para que w seja defendido, é preciso ter no minimo mais c_w 
		vizinhos dentro de S).
		Coloca c_w dentro do nó w.
		Chama DA(S).

##### $DA(S)$
	Varre S e inicia {w, c_w} com o maior c_w do vetor.
	Se c_w <= 0, então não precisa de mais vizinhos na aliança (está protegido)
	e retorna verdadeiro (S é a aliança).
	Caso contrário, se ele não precisar de mais vizinhos do que o tamanho máximo
	(k) da aliança (ou seja, se vai ter espaço):
		Inicia t como metade dos vizinhos de w + 1 (t representa o numero total
		de vizinhos que w precisa em S para estar defendido).
		Inicia W com os vizinhos externos de w (os fora de S, vetor de tamanho t).
		Para i = 0 até t.
			S += W_i.
			Recalcula c_w de todo mundo em S.
			DA(S + W_i)
			Se não achou nada:
				Retira W_i do S e recalcula os c_w.

#### Propriedades
Se S não é uma aliança, então há ao menos um vértice w desprotegido em S. 
	w já tem **x vizinhos em S**.
	e w tem **y vizinhos fora de S**.
	cw = metade do grau de w - x > 0
	cw = numero de vizinhos que precisam entrar em S pra w ficar defendido
	Ou seja, se o cw de todo mundo em S é < 0, então S é uma aliança.
	Cada conjunto S é um subset de uma aliança defensiva, já que o grafo G (ou o conjunto V) é uma aliança defensiva em si.
	S pode não ser um subset de uma aliança de tamanho k ou menos.
	Um conjunto S é dito extendível se existe uma aliança S' <= k tal que S está contido em S'. Todo subset de um conjunto S extendível é também extendível.
	Para um conjunto S <= k, se existe um vértice w tal que cw > k - S, então S não é extendível.
	-> Se o cw for maior que o espaço disponível, nem adianta olhar.

	Lema 14:
	Assumindo que S é extendível para uma alinaça S'
	e que S' = k
	Então, pra cada vértice w desprotegido de S,
	numeroDeVizinhosCorretosQueFaltam >= que o número de vizinhos novos necessários
	prova
	X = os vizinhos novos corretos de w que faltam
	w tem X + numVizinhosEmS >= metade do grau de w vizinhos em S'.
	-> w tem TotalDeVizinhosEmS' >= metade do grau de w.
	Ou seja, X >= metadeDoGrauW - numVizinhosEmS = cw.
	conclusão
	qualquer conjunto extendível com um vértice desprotegido w pode ser expandido seguramente adicionando j vizinhos de w, desde que 1 <= j <= cw
	entendi!
	depois de fazer as desigualdades, é GARANTIDO que se tu olhar metade dos vizinhos + 1 vai haver um cara que você pode expandir SSE for expandível. Isso é vantajoso quando w tem 1 vizinho dentro e 400 fora