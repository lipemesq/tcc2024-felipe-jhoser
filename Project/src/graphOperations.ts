import example from "../public/examples/2.json";

// MARK: - Types

export class Node {
	id: number;
	alliance?: number;

	constructor(id: number, alliance?: number) {
		this.id = id;
		this.alliance = alliance;
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

	/**
	 * Creates a Graph instance from a JSON object.
	 *
	 * @param {any} json - The JSON object to parse.
	 * @returns {Graph} A new Graph instance created from the JSON.
	 */
	static fromJson(json: any): Graph {
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
		graph.prepareGraph();
		return graph;
	}

	/**
	 * Prepares the graph by assigning alliance numbers to nodes and adjusting links based on alliances.
	 * This method iterates through the defensive alliances and assigns the alliance ID to each node that belongs to the alliance.
	 * It then adjusts the links to ensure that if a link has a node from an alliance at one end, it points to that node.
	 * If both nodes of a link belong to the same alliance, a new link is created in the opposite direction.
	 */
	prepareGraph() {
		// Atribui o numero da aliança a qual pertence ao nó
		this.defensiveAlliances?.forEach((da: Alliance) => {
			da.nodes.forEach((nodeId) => {
				const node = this.nodes.find((n) => n.id === nodeId);
				if (node) {
					node.alliance = da.id;
				}
			});
		});

		// se uma aresta tem um membro de uma aliança em uma ponta, aponta para ele
		this.links.forEach((link, index, array) => {
			const sourceNode = link.source;
			const targetNode = link.target;

			if (
				sourceNode.alliance != undefined &&
				targetNode.alliance == undefined
			) {
				const helper = sourceNode;
				array[index].source = array[index].target;
				array[index].target = helper;
			}
		});
	}

	/**
	 * Updates the graph state with a new graph.
	 *
	 * @param {Graph} graph - The new graph to update the state with.
	 * @returns {Graph} This instance of Graph with the updated graph.
	 */
	updateGraph(graph: Graph): Graph {
		return new Graph(
			graph.nodes,
			graph.links,
			graph.defensiveAlliances || []
		);
	}

	/**
	 * Method to remove a node from the graph.
	 * @param {number} nodeId - The ID of the node to remove.
	 * @returns {Graph} The updated graph.
	 */
	removeNode(nodeId: number): Graph {
		// Remove links attached to the node
		const newLinks = this.links.filter(
			(l) => l.source.id != nodeId && l.target.id != nodeId
		);

		// Remove the node
		const newNodes = this.nodes.filter((n) => n.id != nodeId);

		// Reset node ids to array index
		newNodes.forEach((n, idx) => {
			n.id = idx;
		});

		// Update the graph properties directly
		this.nodes = newNodes;
		this.links = newLinks;

		return this;
	}

	/**
	 * Method to add a new connected node to the graph.
	 * This method creates a new node and connects it to a randomly selected existing node.
	 *
	 * @returns {Graph} The updated graph with the new node and link added.
	 */
	addRandomNode(): Graph {
		const id = this.nodes.length;
		const newNode = new Node(id);
		if (this.nodes.length > 0) {
			const targetNode =
				this.nodes[Math.floor(Math.random() * this.nodes.length)];
			this.links.push(new Link(newNode, targetNode));
		}
		this.nodes.push(newNode);

		return this;
	}

	/**
	 * Method to find a node by its ID.
	 * @param {number} nodeId - The ID of the node to find.
	 * @returns {Node | undefined} The node if found, otherwise undefined.
	 */
	findNodeById(nodeId: number): Node | undefined {
		const node: Node | undefined = this.nodes.find(
			(node) => node.id === nodeId
		);
		/*
		console.log(
			"Found node id:",
			nodeId,
			" and alliance: ",
			node?.alliance
		);*/
		return node;
	}
}

// For independent execution for debugging
export const main = () => {
	const exampleData: any = example;
	let graph = Graph.fromJson(exampleData);

	console.log("Initial data:", graph);

	const foundNode = graph.findNodeById(1);
	console.log("Found node alliance:", foundNode?.alliance);

	graph.addRandomNode();
	console.log("Graph after adding random node:", graph);

	graph.addRandomNode();
	console.log("Graph after adding random node:", graph);

	graph.addRandomNode();
	console.log("Graph after adding random node:", graph);

	graph.removeNode(0);
	console.log("Graph after removal:", graph);

	graph.addRandomNode();
	console.log("Graph after adding random node:", graph);
};

if (require.main === module) {
	main();
}
