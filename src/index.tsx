import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ForceGraph3D from "react-force-graph-3d";
import { GraphState, Graph, Node, Link } from "./graphOperations";

// MARK: - JS ForceGraph3D Types

interface NodeObject {
  id: number;
}

interface LinkObject {
  source: NodeObject;
  target: NodeObject;
}

interface DefensiveAlliance {
  id: number;
  nodes: number[];
}

interface GraphData {
  nodes: NodeObject[];
  links: LinkObject[];
  defensiveAlliances: DefensiveAlliance[];
}

const App: React.FC = () => {
  const [state, setState] = useState<GraphState>(new GraphState(new Graph([], [])));
  const [data, setData] = useState<GraphData>({ nodes: [], links: [], defensiveAlliances: [] });
  const [exampleFile, setExampleFile] = useState<string>("1.json"); // Estado para o arquivo de exemplo

  // Array de arquivos de exemplo
  const exampleFiles = ["1.json", "2.json"]; // Adicione mais arquivos conforme necessário

  // Função para carregar os dados do arquivo JSON
  const loadData = async (file: string) => {
    const response = await fetch(`/examples/${file}`);
    const exampleData = await response.json();
    setData(exampleData);
    setState((state) =>
      state.updateGraph(
        new Graph(exampleData.nodes, exampleData.links, exampleData.defensiveAlliances)
      )
    );
  };

  useEffect(() => {
    loadData(exampleFile); // Carrega o exemplo inicial
  }, [exampleFile]);

  // Função para gerar uma paleta de cores dinâmica com base no número de alianças
  const generateColors = (numColors: number): string[] => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      // HSL modelo: variando o Hue para gerar cores diferentes
      const hue = (i * 360) / numColors;
      colors.push(`hsl(${hue}, 100%, 50%)`);
    }
    return colors;
  };

  // Função para colorir nós com base nas alianças defensivas
  const decideNodeColor = useCallback(
    (node: NodeObject) => {
      const nodeId = node.id;
      const alliances = state.graph.defensiveAlliances;
      const numAlliances = alliances?.length || 0;

      // Gerar cores para o número de alianças
      const allianceColors = generateColors(numAlliances);

      // Encontrar a aliança a qual o nó pertence
      const alliance = alliances?.find((alliance) =>
        alliance.nodes.includes(nodeId)
      );

      // Se o nó pertence a uma aliança, retornar a cor correspondente
      if (alliance) {
        return allianceColors[alliance.id] || "grey"; // Usar a cor da aliança ou cinza se não encontrar
      }

      return "grey"; // Cor padrão se o nó não estiver em uma aliança
    },
    [state.graph.defensiveAlliances]
  );

  // Função para lidar com cliques no nó
  const handleNodeClick = useCallback((node: NodeObject) => {
    setState((state) => state.removeNode(node.id));
    setData({ nodes: state.graph.nodes, links: state.graph.links, defensiveAlliances: data.defensiveAlliances });
  }, [data.defensiveAlliances]);

  // Função para adicionar um nó ao clicar no fundo
  const handleBackgroundClick = useCallback(() => {
    setState((state) => state.addRandomNode());
    setData({ nodes: state.graph.nodes, links: state.graph.links, defensiveAlliances: data.defensiveAlliances });
  }, [data.defensiveAlliances]);

  // Função para trocar entre arquivos de exemplo
  const handleExampleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setExampleFile(event.target.value); // Atualiza o arquivo de exemplo selecionado
  };

  return (
    <div>
      <select onChange={handleExampleChange} value={exampleFile}>
        {exampleFiles.map((file) => (
          <option key={file} value={file}>
            {`Exemplo ${file.replace(".json", "")}`}
          </option>
        ))}
      </select>
      <ForceGraph3D
        linkLabel={(link) =>
          `${(link.source as NodeObject).id} -> ${(link.target as NodeObject).id}`
        }
        nodeLabel={(node) => `Node ${node.id}`}
        nodeColor={decideNodeColor}
        enableNodeDrag={false}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        graphData={data}
      />
    </div>
  );
};

// MARK: - HTML

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

