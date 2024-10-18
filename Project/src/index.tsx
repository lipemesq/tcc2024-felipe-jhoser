import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ForceGraph3D from "react-force-graph-3d";
import ForceGraph2D from "react-force-graph-2d";
import { Graph, Node, Link } from "./graphOperations";
import { randomColors } from "./colors";
import ButtonsView from "./buttonsView";

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
	const [step, setStep] = useState<number>(0);

	const [allianceColors, setAllianceColors] = useState<string[]>([]);

	const [fileSelectorLabel, setFileSelectorLabel] = useState<string>("-");

	const exampleFiles = ["1.json", "2.json", "3.json"];
	// const inputFiles = ["4.in", "5.in"];

	useEffect(() => {
		setAllianceColors(randomColors(state.defensiveAlliances?.length ?? 0));
	}, [state]);

	const loadLocalExample = async (file: string) => {
		const response = await fetch(`/examples/${file}`);
		const exampleData = await response.json();
		loadJsonGraph(exampleData);
		setFileSelectorLabel(file);
	};

	const loadImportedExample = async (file: File) => {
		if (file.type === "application/json") {
			const reader = new FileReader();
			reader.onload = async (e) => {
				if (e.target && e.target.result) {
					const exampleData = JSON.parse(e.target.result as string);
					loadJsonGraph(exampleData);
					setFileSelectorLabel("-");
				}
			};
			reader.readAsText(file);
		}
	};

	const loadJsonGraph = async (json: JSON) => {
		const graph = Graph.fromJson(json);
		setState((state) => state.updateGraph(graph));
		setData(graph);
	};

	// TODO: Trocar esse negócio de adicionar nó por focusOnNode

	const handleNodeClick = useCallback((node: NodeObject) => {
		//setState((state) => state.removeNode(node.id));
		//setData({ nodes: state.nodes, links: state.links });
	}, []);

	const handleBackgroundClick = useCallback(() => {
		//setState((state) => state.addRandomNode());
		//setData({ nodes: state.nodes, links: state.links });
	}, []);

	const handleFileSelected = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		loadLocalExample(event.target.value);
	};

	const handleFileImported = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			loadImportedExample(file);
		}
	};

	const decideNodeColor = useCallback(
		(nodeObject: NodeObject) => {
			const node: Node | undefined = state.findNodeById(nodeObject.id);

			if (node && state.steps && state.steps[step].includes(node.id)) {
				return "red";
			}
			/*const nodeAlliance = node?.alliance;
			if (nodeAlliance !== undefined) {
				return allianceColors[nodeAlliance];
			}
			*/
			return "grey";
		},
		[allianceColors, step]
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
				return 3;

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
				return allianceColors[targetNode?.alliance];

			return "grey";
		},
		[allianceColors]
	);

	return (
		<div style={{ position: "relative" }}>
			<ButtonsView
				exampleFiles={exampleFiles}
				handleFileSelected={handleFileSelected}
				fileSelectorLabel={fileSelectorLabel}
				handleFileImported={handleFileImported}
				handleLeftArrowClick={function (): void {
					if (step > 0) setStep(step - 1);
				}}
				handleRightArrowClick={function (): void {
					if (step < (state.steps || []).length - 1)
						setStep(step + 1);
				}}
			/>
			<ForceGraph2D
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
