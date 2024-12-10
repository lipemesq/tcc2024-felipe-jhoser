#!/bin/bash

n_iterations=10               # Número de iterações
n_values=(15 30 45 60)        # Número de vértices
k_values=($(seq 1 30))        # Tamanho das alianças defensivas

# Diretório para saída dos resultados
output_dir="test_results"
mkdir -p "$output_dir"

#Limpa a pasta de saída de execuções anteriores
if [[ -d "$output_dir" && "$(ls -A "$output_dir")" ]]; then
    rm -r "$output_dir"/*
fi

python_script="upgradedFindDefensiveAlliance.py"  # Nome do script Python

# Loop para todas as combinações de n e k
for n in "${n_values[@]}"; do
    k_values=($(seq 1 "$n"))

    mkdir -p "$output_dir/result_n${n}"
    for ((i = 1; i <= n_iterations; i++)); do
        density=$(awk -v n="$n" 'BEGIN {srand(); print (rand() * 0.80) / sqrt(n)}')
    
        output_file="$output_dir/result_n${n}/result_d${density}.txt"
        for k in "${k_values[@]}"; do
            # Executa o script Python com os parâmetros atuais
            echo "Executando: n=$n, k=$k, density=$density (Iteração $i)"
            python3 "$python_script" --v "$n" --k "$k" --e "$density" >> "$output_file"
        done
    done
done

echo "Execução concluída. Verifique os resultados em $output_dir."
