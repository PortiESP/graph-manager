import constants from "./constants"
import { closestHoverNode } from "./find_elements"

export function addNodeToGraph(x, y, r, label = null) {
    // Default radius
    if (r === undefined) r = constants.DEFAULT_NODE_RADIUS

    // Append the node to the list of nodes
    window.graph.nodes.push(new Node(x, y, r, label))
}

export function addEdgeToGraph(src, dst, weight) {
    // Default weight
    if (!weight) weight = constants.DEFAULT_EDGE_WEIGHT

    // If the source and destination nodes are valid and different, add the edge to the list of edges
    if (src && dst && src !== dst) {
        window.graph.edges.push(new Edge(src, dst, weight))
    }

    stopCreatingEdge()
}

export function startCreatingNode() {
    window.graph.newNode = true
}

export function stopCreatingNode() {
    window.graph.newNode = false
}

export function startCreatingEdge() {
    window.graph.newEdgeScr = closestHoverNode()
    return window.graph.newEdgeScr
}

export function stopCreatingEdge() {
    window.graph.newEdgeScr = null
}

export function isCreatingEdge() {
    return window.graph.newEdgeScr !== null
}