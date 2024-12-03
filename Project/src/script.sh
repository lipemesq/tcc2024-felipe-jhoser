#!/bin/bash

n_iterations=3                # Número de iterações
n_values=(50 100)             # Número de vértices
k_values=(5 10)               # Tamanho das alianças defensivas
density_values=(0.05 0.1)     # Probabilidade de aresta

# Diretório para saída dos resultados
output_dir="test_results"
mkdir -p "$output_dir"

# Limpa a pasta de saída de execuções anteriores
if [[ -d "$output_dir" && "$(ls -A "$output_dir")" ]]; then
    rm -r "$output_dir"/*
fi

python_script="upgradedFindDefensiveAlliance.py"  # Nome do script Python

# Loop para todas as combinações de n, k, density
for n in "${n_values[@]}"; do
    for k in "${k_values[@]}"; do
        for density in "${density_values[@]}"; do
            echo "Executando testes para n=$n, k=$k, density=$density"
            total_nodes=0
            for ((i=1; i<=n_iterations; i++)); do
                output_file="$output_dir/result_n${n}_k${k}_d${density}_iter${i}.txt"

                # Executa o script Python com os parâmetros atuais
                python3 "$python_script" --v "$n" --k "$k" --e "$density" > "$output_file"

                # Extrai o número de nós explorados do arquivo de saída
                explored_nodes=$(grep -oP "Número de nós explorados e passos dados: \K\d+" "$output_file" || echo "0")

                total_nodes=$((total_nodes + explored_nodes))
                
                # Verifica se a aliança defensiva foi encontrada
                if grep -q "Aliança defensiva de tamanho" "$output_file"; then
                    echo "Iteração $i: Aliança defensiva encontrada (n=$n, k=$k, density=$density)" >> "$output_dir/summary.txt"
                else
                    echo "Iteração $i: Nenhuma aliança encontrada (n=$n, k=$k, density=$density)" >> "$output_dir/summary.txt"
                fi
            done 
            # Calcula a média dos nós explorados
            avg_nodes=$((total_nodes / n_iterations))
            echo "Média dos nós explorados para n=$n, k=$k, density=$density: $avg_nodes" >> "$output_dir/summary.txt"
        done
    done
done
echo "Verifique o sumário em $output_dir/summary.txt."
