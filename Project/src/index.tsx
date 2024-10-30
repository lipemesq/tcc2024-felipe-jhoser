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
	const [maxSteps, setMaxSteps] = useState<number>(0);

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
		setMaxSteps((graph.steps ?? []).length);
		setStep(0);
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

			if (
				node &&
				state.steps &&
				state.steps[step].node_cw.find((ncw) => ncw.node == node.id)
			) {
				const nodeIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node == node.id
				);
				if (step == maxSteps - 1) return "green";
				else {
					if (nodeIn?.cw ?? 1 > 0) return "blue";
					else return "lightGreen";
				}
			} else if (node && state.steps) {
				const isNeighbor = state.steps[step].node_cw.some((ncw) => {
					return state.links.some((link) => {
						return (
							(link.source.id === node.id &&
								link.target.id === ncw.node) ||
							(link.target.id === node.id &&
								link.source.id === ncw.node)
						);
					});
				});
				if (isNeighbor) return "grey";
			}

			return "lightGrey";
		},
		[allianceColors, step]
	);

	const decideLinkDirectionalArrowLength = useCallback(
		(linkObject: LinkObject): number => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);

			if (sourceNode && state.steps && targetNode) {
				const isSourceIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node == sourceNode.id
				);
				const isTargetIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node === targetNode.id
				);
				if (!isSourceIn && isTargetIn)
					if (step == maxSteps - 1) return 5;
			}

			return 0;
		},
		[state, step]
	);

	const decideLinkWidth = useCallback(
		(linkObject: LinkObject): number => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);

			if (sourceNode && state.steps && targetNode) {
				const isSourceIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node == sourceNode.id
				);
				const isTargetIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node === targetNode.id
				);
				if (
					(!isSourceIn && isTargetIn) ||
					(isSourceIn && !isTargetIn) ||
					(isSourceIn && isTargetIn)
				)
					return 3;
			}

			return 1;
		},
		[state, step]
	);

	const decideLinkColor = useCallback(
		(linkObject: LinkObject): string => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);
			if (state.steps && sourceNode && targetNode) {
				const isSourceIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node == sourceNode.id
				);
				const isTargetIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node === targetNode.id
				);
				if (isSourceIn && isTargetIn)
					if (step == maxSteps - 1) return "green";
					else return "blue";
				else if (
					(!isSourceIn && isTargetIn) ||
					(isSourceIn && !isTargetIn)
				) {
					const nodeIn = isSourceIn || isTargetIn;
					//if (nodeIn?.cw ?? 1 > 0) return "grey";
					//else return "lightGreen";
					return "grey";
				}
			}
			// return allianceColors[targetNode?.alliance];

			return "lightGrey";
		},
		[allianceColors, step]
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
					if (step < maxSteps - 1) setStep(step + 1);
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
