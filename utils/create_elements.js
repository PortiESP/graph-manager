import { Edge } from "../elements/edge"
import { Node } from "../elements/node"
import constants from "./constants"
import { closestHoverNode } from "./find_elements"

/**
 * Adds a new node to the graph global variable.
 * 
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {number} r - The radius of the node.
 * @param {string} label - The label of the node.
 */
export function addNodeToGraph(x, y, r, label = null) {
    // Default radius
    if (r === undefined) r = constants.DEFAULT_NODE_RADIUS

    // Append the node to the list of nodes
    window.graph.nodes.push(new Node(x, y, r, label))
}

/**
 * Adds a new edge to the graph global variable.
 * 
 * @param {Node} src - The source node of the edge.
 * @param {Node} dst - The destination node of the edge.
 * @param {number} weight - The weight of the edge.
 */
export function addEdgeToGraph(src, dst, weight) {
    // Default weight
    if (!weight) weight = constants.DEFAULT_EDGE_WEIGHT

    // If the source and destination nodes are valid and different, add the edge to the list of edges
    if (src && dst && src !== dst) {
        window.graph.edges.push(new Edge(src, dst, weight))
    }

    stopCreatingEdge()
}

/**
 * Starts the process of creating a new node.
 */
export function startCreatingNode() {
    window.graph.newNode = true
}

/**
 * Stops the process of creating a new node. This function will not instantiate a new node nor add it to the graph.
 */
export function stopCreatingNode() {
    window.graph.newNode = false
}

/**
 * Returns whether the user is creating a new node.
 *  
 * @returns {boolean} Whether the user was hovering a node to start creating a new edge. If true, the user is creating a new edge. If false, the user is not creating a new edge.
 */
export function startCreatingEdge() {
    window.graph.newEdgeScr = closestHoverNode()
    return window.graph.newEdgeScr
}

/**
 * Stops the process of creating a new edge. This function will not instantiate a new edge nor add it to the graph.
 */
export function stopCreatingEdge() {
    window.graph.newEdgeScr = null
}

/**
 * Returns whether the user is creating a new edge.
 *  
 * @returns {boolean} Whether the user is creating a new edge. If true, the user is creating a new edge. If false, the user is not creating a new edge.
 */
export function isCreatingEdge() {
    return window.graph.newEdgeScr !== null
}