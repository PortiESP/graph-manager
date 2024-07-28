import { getNodeById } from "../../arrangements"

/**
 * 
 * @param {Object} predecessors Object representing the predecessors of each node: {Node: Node, ...}
 * @returns {Object} An object with the following properties:
 * - levels: The level of each node in the graph. If the node was not visited (mostly due to a cycle), the level is null
 * - maxLevel: The maximum level of the graph
 */
export function generateLevelsByPredecessors(predecessors) {
    const levels = Object.fromEntries(Object.keys(predecessors).map(node => [node, undefined]))
    let maxLevel = 0

    const queue = Object.keys(predecessors)
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()

        // If the node has no predecessors, it is a root
        if (predecessors[node] === null) {
            levels[node] = 0
            continue
        }
        
        // Get the predecessor of the node
        const pre = predecessors[node]
        // If the predecessor has no level, it means that it has not been processed yet, so we add the node to the end of the queue
        if (levels[pre] === undefined) {
            queue.push(node)
            continue
        }

        // Update the level of the node
        const level = levels[pre] + 1
        levels[node] = level
    }

    return { levels, maxLevel }
}


/**
 * Generate the successors of each node based on the predecessors
 * 
 * @param {Object} predecessors Object representing the predecessors of each node: {Node: Node, ...}
 * @returns {Object} An object with the successors of each node: {Node: [Node, ...], ...}
 */
export function generateSuccessorsByPredecessors(predecessors) {
    const successors = Object.fromEntries(Object.keys(predecessors).map(node => [node, []]))

    for (const node in predecessors) {
        const pre = predecessors[node]
        if (pre === null) continue

        successors[pre].push(getNodeById(node))
    }

    return successors
}


/**
 * Get the edges of the graph based on a predecessors object
 * 
 * @param {Object} predecessors Object representing the predecessors of each node: {Node: "Node", ...}
 * @returns {Array[Edge]} The edges of the graph
 */
export function generateEdgesByPredecessors(predecessors) {
    const edges = []
    for (const node in predecessors) {
        const pre = predecessors[node]
        if (pre === null) continue

        edges.push(window.graph.findEdgeByNodes(pre, node))
    }

    return edges
}


/**
 * Generate the path of edges from a predecessors object
 * 
 * The end node must be reachable from the start node
 * 
 * @param {Object} predecessors Object representing the predecessors of each node: {Node: "Node", ...}
 * @param {String} start The start node
 * @param {String} end The end node
 * @returns {Array[Edge]} The path of edges from start to end
 * @returns {undefined} If the end node is not reachable from the start node
 */
export function generateEdgesPathByPredecessors(predecessors, start, end) {
    const path = []
    let current = end
    // Follow the predecessors from the end node until the start node is reached or the current node has no predecessor
    while (current !== start && predecessors[current] !== null) {
        const pre = predecessors[current]
        path.push(window.graph.findEdgeByNodes(pre, current))
        current = pre
    }

    // The end node is not reachable from the start node
    if (current !== start) return undefined

    return path
}


/**
 * Get the edges of the graph based on a nodes array
 * 
 * @param {Array[Node]} nodes The nodes of the graph
 * @returns {Array[Edge]} The edges of the graph
 */
export function generateEdgesByNodesPath(nodesPath) {
    const edges = []
    for (let i = 0; i < nodesPath.length - 1; i++) {
        edges.push(window.graph.findEdgeByNodes(nodesPath[i], nodesPath[i + 1]))
    }

    return edges
}