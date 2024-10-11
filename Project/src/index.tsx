import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ForceGraph3D from "react-force-graph-3d";
import ForceGraph2D from "react-force-graph-2d";
import { Graph, Node, Link } from "./graphOperations";
import { randomColors } from "./colors";

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
	const [state, setState] = useState<Graph>(new Graph([], []));
	const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

	const [allianceColors, setAllianceColors] = useState<string[]>([]);

	const [exampleFile, setExampleFile] = useState<string>("1.json");
	const [fileInput, setFileInput] = useState<File | null>(null); // Estado para o arquivo selecionado

	const exampleFiles = ["1.json", "2.json", "3.json"];
	// const inputFiles = ["4.in", "5.in"];

	const loadLocalExample = async (file: string) => {
		const response = await fetch(`/examples/${file}`);
		const exampleData = await response.json();
		loadJsonExample(exampleData);
	};

	const loadImportedExample = async (file: string) => {
		const response = await fetch(`/examples/${file}`);
		const exampleData = await response.json();
		loadJsonExample(exampleData);
	};

	const loadJsonExample = async (json: JSON) => {
		const graph = Graph.fromJson(json);
		setState((state) => state.updateGraph(graph));
		setData(graph);
	};

	useEffect(() => {
		loadLocalExample(exampleFile); // Carrega o exemplo inicial
	}, [exampleFile]);

	useEffect(() => {
		setAllianceColors(randomColors(state.defensiveAlliances?.length ?? 0));
	}, [state]);

	// TODO: Trocar esse negócio de adicionar nó por focusOnNode

	const handleNodeClick = useCallback((node: NodeObject) => {
		//setState((state) => state.removeNode(node.id));
		//setData({ nodes: state.nodes, links: state.links });
	}, []);

	const handleBackgroundClick = useCallback(() => {
		//setState((state) => state.addRandomNode());
		//setData({ nodes: state.nodes, links: state.links });
	}, []);

	const handleExampleChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		setExampleFile(event.target.value);
	};

	const handleImportFile = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files.length > 0) {
			const file1 = event.target.files[0];
			if (file1.type === "application/json") {
				const reader = new FileReader();
				reader.onload = async (e) => {
					if (e.target && e.target.result) {
						const exampleData = JSON.parse(
							e.target.result as string
						);
						loadJsonExample(exampleData);
					}
				};
				reader.readAsText(file1);
			}
		}
	};

	const decideNodeColor = useCallback(
		(nodeObject: NodeObject) => {
			const node: Node | undefined = state.findNodeById(nodeObject.id);
			const nodeAlliance = node?.alliance;
			if (nodeAlliance !== undefined) {
				return allianceColors[nodeAlliance];
			}
			return "grey";
		},
		[allianceColors]
	);

	const decideLinkDirectionalArrowLength = useCallback(
		(linkObject: LinkObject): number => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);
			if (
				sourceNode?.alliance == undefined &&
				targetNode?.alliance != undefined
			)
				return 3;

			return 0;
		},
		[state]
	);

	const decideLinkWidth = useCallback(
		(linkObject: LinkObject): number => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);
			if (
				sourceNode?.alliance !== undefined &&
				sourceNode?.alliance === targetNode?.alliance
			)
				return 2;

			return 1;
		},
		[state]
	);

	const decideLinkColor = useCallback(
		(linkObject: LinkObject): string => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);
			if (
				sourceNode?.alliance !== undefined &&
				sourceNode?.alliance === targetNode?.alliance
			)
				return allianceColors[sourceNode?.alliance];

			return "grey";
		},
		[state, allianceColors]
	);

	const changeSelectValue = (newValue: string) => {
		const selectElement = document.getElementById(
			"exampleSelect"
		) as HTMLSelectElement;
		if (selectElement) {
			selectElement.value = newValue;
		}
	};

	return (
		<div style={{ position: "relative" }}>
			<div
				style={{
					backgroundColor: "transparent",
					padding: "10px",
					display: "flex",
					flexDirection: "row",
					position: "absolute",
					top: "25px",
					left: "25px",
					zIndex: 10,
				}}
			>
				<select
					id="exampleSelect"
					onChange={handleExampleChange}
					value={exampleFile}
				>
					<optgroup label="Grafos prontos">
						{exampleFiles.map((file) => (
							<option key={file} value={file}>
								{`Exemplo ${file.replace(".json", "")}`}
							</option>
						))}
					</optgroup>
					{/* <optgroup label="Calcular aliança">
						{inputFiles.map((file) => (
							<option key={file} value={file}>
								{`Input ${file.replace(".in", "")}`}
							</option>
						))}
					</optgroup> */}
				</select>
				<input
					id="fileInput"
					type="file"
					accept=".json, .in"
					onChange={handleImportFile}
					style={{ marginLeft: "10px" }}
				/>
			</div>
			<ForceGraph3D
				linkLabel={(link) =>
					`${(link.source as NodeObject).id} -> ${
						(link.target as NodeObject).id
					}`
				}
				nodeLabel={(node) => `Node ${node.id}`}
				nodeColor={decideNodeColor}
				enableNodeDrag={true}
				//onNodeClick={handleNodeClick}
				//onBackgroundClick={handleBackgroundClick}
				linkCurvature={0.0}
				linkWidth={decideLinkWidth}
				linkColor={decideLinkColor}
				linkDirectionalArrowLength={decideLinkDirectionalArrowLength}
				linkDirectionalArrowRelPos={1}
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
