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
