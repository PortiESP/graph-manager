
/**
 * Topological sort algorithm using Kahn's algorithm
 * 
 * @param {Object} graph Graph represented as an adjacency list: {Node: [Edge, ...], ...]}
 * @returns {Object} An object with the following properties:
 * - result: The nodes in the order they were visited
 * - prevNode: The previous node for each node
 * - hasCycle: A boolean indicating if the graph has a cycle
 * - remainingNodes: The nodes that were not visited
 * - levels: The level of each node in the graph. If the node was not visited (mostly due to a cycle), the level is null
 */
export function toposortKahn(graph) {
    if (graph === undefined) throw new Error('Invalid graph')

    const result = []    // Store the result of the algorithm (ordered nodes)
    const prevNode = {}  // Store the previous node for each node (the latest node that points to the current node)
    const levels = {}    // Store the levels of each node based on the level of the previous node

    const queue = []     // Store the nodes with inDegree 0
    const inDegree = {}  // Store the number of incoming edges for each node

    // Initialize the inDegree and levels of all nodes
    for (const node in graph) {
        inDegree[node] = 0
        levels[node] = null
    }

    // Calculate the inDegree of all nodes
    for (const node in graph) {
        for (const {dst} of graph[node]) {
            inDegree[dst]++
        }
    }

    // Add all nodes with inDegree 0 to the queue
    for (const node in inDegree) {
        if (inDegree[node] === 0) {
            queue.push(node)
            levels[node] = 0
        }
    }

    // While the queue is not empty
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()
        result.push(node) // Add the node to the result

        // Add to the queue the neighbors of the node with no incoming edges (inDegree: 0) (this means that the node has no dependencies)
        for (let {src, dst} of graph[node]) {
            src = src.id
            dst = dst.id

            // Process the neighbor node
            inDegree[dst]--  // Decrease the inDegree of the neighbor node (since the current node is being processed)
            levels[dst] = Math.max(levels[dst], levels[src] + 1) // Update the level of the neighbor node (based on the level of the current node and current level of the neighbor node)

            // If the dst has inDegree 0 (no dependencies), add it to the queue
            if (inDegree[dst] === 0) {
                queue.push(dst)
                prevNode[dst] = node // Add the current node as the previous node for the neighbor node (latest)
            }
        }
    }

    // Find the remaining nodes (nodes that still have dependencies)
    const remainingNodes = Object.keys(graph).filter(node => !result.includes(node))
    // Check if the graph has a cycle (if there are remaining nodes)
    const hasCycle = remainingNodes.length > 0

    // Return the result, the previous node for each node, the remaining nodes, the levels and if the graph has a cycle
    return { result, prevNode, hasCycle, remainingNodes, levels}
}