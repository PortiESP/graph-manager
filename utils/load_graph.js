import { Edge } from "../elements/edge";
import { Node } from "../elements/node";
import { setupGraphGlobals } from "../globals";

export function loadFromJSON(json) {
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Load the nodes
    const nodes = json.nodes.map(n => new Node(n.x, n.y, n.r, n.label))

    // Load the edges
    const edges = json.edges.map(e => {
        const src = nodes.find(n => n.label === e.src)
        const dst = nodes.find(n => n.label === e.dst)
        const directed = e.directed || false
        return new Edge(src, dst, e.weight, directed)
    })

    // Add the nodes and edges to the graph
    window.graph.nodes.push(...nodes)
    window.graph.edges.push(...edges)
}