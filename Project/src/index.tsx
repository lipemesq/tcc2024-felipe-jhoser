import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ForceGraph3D from "react-force-graph-3d";
import ForceGraph2D from "react-force-graph-2d";
import { Graph, Node, Link } from "./graphOperations";
import { randomColors, getColorFromTemp } from "./colors";
import ButtonsView from "./buttonsView";
import ColorBar from "./ColorBar"; // Import the ColorBar component

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

const NODE_R = 4;

const App: React.FC = () => {
	const [state, setState] = useState<Graph>(
		new Graph([], [], new Map(), new Map())
	);
	const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
	const [step, setStep] = useState<number>(0);
	const [maxSteps, setMaxSteps] = useState<number>(0);

	const [allianceColors, setAllianceColors] = useState<string[]>([]);

	const [fileSelectorLabel, setFileSelectorLabel] = useState<string>("-");

	const exampleFiles = ["1.json", "2.json", "3.json"];
	// const inputFiles = ["4.in", "5.in"];

	const [highlightNodes, setHighlightNodes] = useState<Set<any>>(new Set());
	const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());
	const [hoverNode, setHoverNode] = useState<any>(null);

	const [is3DView, setIs3DView] = useState(false);
	const [isHeatmap, setIsHeatmap] = useState(false);

	const updateHighlight = () => {
		setHighlightNodes(new Set(highlightNodes));
		setHighlightLinks(new Set(highlightLinks));
	};

	const handleNodeHover = (node: any) => {
		highlightNodes.clear();
		highlightLinks.clear();

		if (node) {
			highlightNodes.add(node);
			if (node.neighbors) {
				node.neighbors.forEach((neighbor: any) =>
					highlightNodes.add(neighbor)
				);
			}
			if (node.links) {
				node.links.forEach((link: any) => highlightLinks.add(link));
			}
		}

		setHoverNode(node || null);
		updateHighlight();
	};

	const handleLinkHover = (link: any) => {
		highlightNodes.clear();
		highlightLinks.clear();

		if (link) {
			highlightLinks.add(link);
			highlightNodes.add(link.source);
			highlightNodes.add(link.target);
		}

		updateHighlight();
	};

	const paintRing = useCallback(
		(node: any, ctx: any) => {
			// add ring just for highlighted nodes
			ctx.beginPath();
			ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
			ctx.fillStyle = node === hoverNode ? "red" : "orange";
			ctx.fill();
		},
		[hoverNode]
	);

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

	const handleNodeClick = useCallback((node: NodeObject) => {}, []);

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

			if (isHeatmap && node) {
				const heat = state.heatMap.get(node.id);
				const color = getColorFromTemp(heat ?? 0);
				const compressedHeat = (heat ?? 0) * 0.8 + 0.2;
				return `rgba(${color.r}, ${color.g}, ${color.b}, ${compressedHeat})`;
			}

			if (is3DView) {
				if (highlightNodes.has(node)) {
					return "red";
				}
			}

			if (
				node &&
				state.steps &&
				state.steps.length > 0 &&
				state.steps[step].node_cw.find((ncw) => ncw.node == node.id)
			) {
				const nodeIn = state.steps[step].node_cw.find(
					(ncw) => ncw.node == node.id
				);
				if (step == maxSteps - 1) {
					if (state.defensiveAlliances?.length ?? 0 > 0)
						return "green";
					return "red";
				} else {
					if (nodeIn?.cw ?? 1 > 0) return "blue";
					else return "lightGreen";
				}
			} else if (node && state.steps && state.steps.length > 0) {
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
		[allianceColors, step, is3DView, highlightNodes, isHeatmap, state]
	);

	const decideLinkDirectionalArrowLength = useCallback(
		(linkObject: LinkObject): number => {
			const sourceNode = state.findNodeById(linkObject.source.id);
			const targetNode = state.findNodeById(linkObject.target.id);

			if (
				sourceNode &&
				state.steps &&
				state.steps.length > 0 &&
				targetNode
			) {
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

			if (
				sourceNode &&
				state.steps &&
				state.steps.length > 0 &&
				targetNode
			) {
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

			if (is3DView) {
				if (highlightLinks.has(linkObject)) {
					return "orange";
				}
			}

			if (
				state.steps &&
				state.steps.length > 0 &&
				sourceNode &&
				targetNode
			) {
				const isSourceIn = state.steps[step]?.node_cw?.find(
					(ncw) => ncw.node == sourceNode.id
				);
				const isTargetIn = state.steps[step]?.node_cw?.find(
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
		[allianceColors, step, is3DView, highlightLinks]
	);

	const decideNodeLabel = useCallback(
		(nodeObject: NodeObject): string => {
			const node = state.findNodeById(nodeObject.id);

			if (node && state.stepsCount.get(node.id)) {
				return `Node ${node.id}<br/>(${state.stepsCount.get(node.id)})`;
			}

			return `Node ${nodeObject.id}`;
		},
		[state]
	);

	const handleViewSwitch = () => {
		setIs3DView(!is3DView);
	};

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
				handleViewSwitch={handleViewSwitch}
				is3DView={is3DView}
				handleDoubleLeftArrowClick={function (): void {
					setStep(0);
				}}
				handleDoubleRightArrowClick={function (): void {
					setStep(maxSteps - 1);
				}}
				handleHeatmapSwitch={function (): void {
					setIsHeatmap(!isHeatmap);
				}}
				isHeatmap={isHeatmap}
			/>
			{isHeatmap && <ColorBar stepCount={state.stepsCount} />}
			{is3DView ? (
				<ForceGraph3D
					linkLabel={(link) =>
						`${(link.source as NodeObject).id} -> ${
							(link.target as NodeObject).id
						}`
					}
					nodeLabel={decideNodeLabel}
					nodeColor={decideNodeColor}
					enableNodeDrag={false}
					// onNodeClick={handleNodeClick}
					linkDirectionalParticles={2}
					linkDirectionalParticleWidth={(link) =>
						highlightLinks.has(link) ? 4 : 0
					}
					onNodeHover={handleNodeHover}
					onLinkHover={handleLinkHover}
					//onBackgroundClick={handleBackgroundClick}
					linkCurvature={0.0}
					linkWidth={decideLinkWidth}
					linkColor={decideLinkColor}
					linkDirectionalArrowLength={
						decideLinkDirectionalArrowLength
					}
					linkDirectionalArrowRelPos={1}
					graphData={data}
				/>
			) : (
				<ForceGraph2D
					linkLabel={(link) =>
						`${(link.source as NodeObject).id} -> ${
							(link.target as NodeObject).id
						}`
					}
					nodeLabel={decideNodeLabel}
					nodeColor={decideNodeColor}
					enableNodeDrag={true}
					// onNodeClick={handleNodeClick}
					linkDirectionalParticles={2}
					linkDirectionalParticleWidth={(link) =>
						highlightLinks.has(link) ? 4 : 0
					}
					nodeCanvasObjectMode={(node: any) =>
						highlightNodes.has(node) ? "before" : undefined
					}
					nodeCanvasObject={paintRing}
					onNodeHover={handleNodeHover}
					onLinkHover={handleLinkHover}
					//onBackgroundClick={handleBackgroundClick}
					linkCurvature={0.0}
					linkWidth={decideLinkWidth}
					linkColor={decideLinkColor}
					linkDirectionalArrowLength={
						decideLinkDirectionalArrowLength
					}
					linkDirectionalArrowRelPos={1}
					graphData={data}
				/>
			)}
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
