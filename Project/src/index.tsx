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

interface GraphData {
	nodes: NodeObject[];
	links: LinkObject[];
}

const App: React.FC = () => {
	const [state, setState] = useState<GraphState>(
		new GraphState(new Graph([], []))
	);
	const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
	const [exampleFile, setExampleFile] = useState<string>("1.json"); // Estado para o arquivo de exemplo

	// Array de arquivos de exemplo
	const exampleFiles = ["1.json", "2.json"]; // Adicione mais arquivos conforme necessário

	const loadData = async (file: string) => {
		const response = await fetch(`/examples/${file}`);
		const exampleData = await response.json();
		setData(exampleData);
		setState((state) =>
			state.updateGraph(
				new Graph(
					exampleData.nodes,
					exampleData.links,
					exampleData.defensiveAlliances
				)
			)
		);
	};

	useEffect(() => {
		loadData(exampleFile); // Carrega o exemplo inicial
	}, [exampleFile]);

	const handleNodeClick = useCallback((node: NodeObject) => {
		setState((state) => state.removeNode(node.id));
		setData({ nodes: state.graph.nodes, links: state.graph.links });
	}, []);

	const handleBackgroundClick = useCallback(() => {
		setState((state) => state.addRandomNode());
		setData({ nodes: state.graph.nodes, links: state.graph.links });
	}, []);

	const handleExampleChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setExampleFile(event.target.value); // Atualiza o arquivo de exemplo selecionado
	};

	const decideNodeColor = useCallback((node: NodeObject) => {
		const nodeId = node.id;
		if (
			state.graph.defensiveAlliances?.reduce(
				(acc, alliance) => acc || alliance.nodes.includes(nodeId),
				false
			)
		) {
			return "#800000";
		}
		return "grey";
	}, []);

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
					`${(link.source as NodeObject).id} -> ${
						(link.target as NodeObject).id
					}`
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

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
