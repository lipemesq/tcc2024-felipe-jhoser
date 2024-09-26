import example from "../public/examples/1.json";

// MARK: - Types

export class Node {
	id: number;

	constructor(id: number) {
		this.id = id;
	}
}

export class Link {
	source: Node;
	target: Node;

	constructor(source: Node, target: Node) {
		this.source = source;
		this.target = target;
	}
}

export class Alliance {
	id: number;
	nodes: number[];

	constructor(id: number, nodes: number[]) {
		this.id = id;
		this.nodes = nodes;
	}
}

export class Graph {
	nodes: Node[];
	links: Link[];
	defensiveAlliances?: Alliance[];

	constructor(nodes: Node[], links: Link[], defensiveAlliances?: Alliance[]) {
		this.nodes = nodes;
		this.links = links;
		this.defensiveAlliances = defensiveAlliances;
	}
}
export class GraphState {
	graph: Graph;

	constructor(graph: Graph) {
		this.graph = graph;
	}

	/**
	 * Creates a GraphState instance from a JSON object.
	 *
	 * @param {any} json - The JSON object to parse.
	 * @returns {GraphState} A new GraphState instance created from the JSON.
	 */
	static fromJson(json: any): GraphState {
		const nodes = json.nodes.map((node: any) => new Node(node.id));
		const links = json.links.map((link: any) => {
			const sourceNode = nodes.find(
				(node: any) => node.id === link.source
			);
			const targetNode = nodes.find(
				(node: any) => node.id === link.target
			);
			return new Link(sourceNode, targetNode);
		});
		const defensiveAlliances = json.defensiveAlliances?.map(
			(alliance: any) => {
				const allianceNodes = alliance.nodes.map(
					(nodeId: number) =>
						nodes.find((node: any) => node.id === nodeId).id
				);
				return new Alliance(alliance.id, allianceNodes);
			}
		);
		const graph = new Graph(nodes, links, defensiveAlliances);
		return new GraphState(graph);
	}

	/**
	 * Updates the graph state with a new graph.
	 *
	 * @param {Graph} graph - The new graph to update the state with.
	 * @returns {GraphState} This instance of GraphState with the updated graph.
	 */
	updateGraph(graph: Graph): GraphState {
		this.graph = graph;
		return this;
	}

	/**
	 * Method to remove a node from the graph.
	 * @param {number} nodeId - The ID of the node to remove.
	 * @returns {Graph} The updated graph.
	 */
	removeNode(nodeId: number): GraphState {
		// Remove links attached to the node
		const newLinks = this.graph.links.filter(
			(l) => l.source.id != nodeId && l.target.id != nodeId
		);

		// Remove the node
		const newNodes = this.graph.nodes.filter((n) => n.id != nodeId);

		// Reset node ids to array index
		newNodes.forEach((n, idx) => {
			n.id = idx;
		});

		// Update the graph properties directly
		this.graph.nodes = newNodes;
		this.graph.links = newLinks;

		return this;
	}

	/**
	 * Method to add a new connected node to the graph.
	 * This method creates a new node and connects it to a randomly selected existing node.
	 *
	 * @returns {Graph} The updated graph with the new node and link added.
	 */
	addRandomNode(): GraphState {
		const id = this.graph.nodes.length;
		const newNode = new Node(id);
		if (this.graph.nodes.length > 0) {
			const targetNode =
				this.graph.nodes[
					Math.floor(Math.random() * this.graph.nodes.length)
				];
			this.graph.links.push(new Link(newNode, targetNode));
		}
		this.graph.nodes.push(newNode);

		return this;
	}
}

// For independent execution for debugging
export const main = () => {
	let data: Graph = new Graph(
		example.nodes.map((n: any) => new Node(n.id)),
		example.links.map(
			(l: any) => new Link(new Node(l.source), new Node(l.target))
		)
	);

	console.log("Initial data:", data);

	const graphState = new GraphState(new Graph(data.nodes, data.links));

	graphState.addRandomNode();
	console.log("Graph after adding random node:", graphState.graph);

	graphState.addRandomNode();
	console.log("Graph after adding random node:", graphState.graph);

	graphState.addRandomNode();
	console.log("Graph after adding random node:", graphState.graph);

	graphState.removeNode(0);
	console.log("Graph after removal:", graphState.graph);

	graphState.addRandomNode();
	console.log("Graph after adding random node:", graphState.graph);
};

if (require.main === module) {
	main();
}
