"use strict";
// MARK: - Types
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.GraphState = exports.Graph = exports.Link = exports.Node = void 0;
class Node {
    constructor(id) {
        this.id = id;
    }
}
exports.Node = Node;
class Link {
    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
}
exports.Link = Link;
class Graph {
    constructor(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }
}
exports.Graph = Graph;
class GraphState {
    constructor(graph) {
        this.graph = graph;
    }
    /**
     * Method to get the current state of the graph.
     * @returns {Graph} The current state of the graph.
     */
    getCurrentState() {
        return this.graph;
    }
    /**
     * Method to remove a node from the graph.
     * @param {number} nodeId - The ID of the node to remove.
     * @returns {Graph} The updated graph.
     */
    removeNode(nodeId) {
        // Remove links attached to the node
        const newLinks = this.graph.links.filter(l => l.source.id !== nodeId && l.target.id !== nodeId);
        // Remove the node
        const newNodes = this.graph.nodes.filter(n => n.id !== nodeId);
        // Reset node ids to array index
        newNodes.forEach((n, idx) => { n.id = idx; });
        // Update the graph properties directly
        this.graph.nodes = newNodes;
        this.graph.links = newLinks;
        return this.graph;
    }
    /**
     * Method to add a new connected node to the graph.
     * This method creates a new node and connects it to a randomly selected existing node.
     *
     * @returns {Graph} The updated graph with the new node and link added.
     */
    addRandomNode() {
        const id = this.graph.nodes.length;
        const newNode = new Node(id);
        const targetNode = this.graph.nodes[Math.floor(Math.random() * this.graph.nodes.length)];
        this.graph.nodes.push(newNode);
        this.graph.links.push(new Link(newNode, targetNode));
        return this.graph;
    }
}
exports.GraphState = GraphState;
// For independent execution for debugging
const main = () => {
    let data = { nodes: [{ id: 0 }], links: [] };
    const setData = (newData) => {
        data = newData;
        console.log('Updated data:', data);
    };
    console.log('Initial data:', data);
    const graphState = new GraphState(new Graph(data.nodes, data.links));
    graphState.removeNode(0);
    console.log('Graph after removal:', graphState.getCurrentState);
    graphState.addRandomNode();
    console.log('Graph after adding random node:', graphState.getCurrentState);
};
exports.main = main;
if (require.main === module) {
    (0, exports.main)();
}
//# sourceMappingURL=graphOperations.js.map