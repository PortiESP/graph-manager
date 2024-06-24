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

export function getEdgesByPredecessors(predecessors) {
    const edges = []
    for (const node in predecessors) {
        const pre = predecessors[node]
        if (pre === null) continue

        edges.push(window.graph.findEdgeByNodes(pre, node))
    }

    return edges
}