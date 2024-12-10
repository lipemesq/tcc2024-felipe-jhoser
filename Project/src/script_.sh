#!/bin/bash
n_iterations=3                # Número de iterações
n_values=(15)                 # Número de vértices
k_values=($(seq 1 15))        # Tamanho das alianças defensivas
density_values=(0.01)         # Probabilidade de aresta

# Diretório para saída dos resultados
output_dir="test_results"
mkdir -p "$output_dir"

python_script="upgradedFindDefensiveAlliance.py"  # Nome do script Python

# Loop para todas as combinações de n, density, k
for n in "${n_values[@]}"; do
    for density in "${density_values[@]}"; do
        output_file="$output_dir/result_n${n}_d${density}.txt"
        for k in "${k_values[@]}"; do
            # Executa o script Python com os parâmetros atuais
            ./"$python_script" --v "$n" --k "$k" --e "$density" >> "$output_file"
        done
    done
done

echo "Verifique o sumário em $output_dir/summary.txt."

