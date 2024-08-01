/**
 * Breadth-first search algorithm
 * 
 * - The algorithm will visit all the nodes accessible from the start node in the graph.
 * 
 * @param {Object} graph Graph represented as an adjacency list: {Node: [Edge, ...], ...]}
 * @param {String} start Start node. The node must be a key in the graph object
 * @param {Object} visited Object to store the visited nodes. The object must have the same keys as the graph object and the values must be booleans
 * @returns {Object} An object with the following properties:
 * - result: The nodes in the order they were visited
 * - visited: The visited nodes
 * - prevNode: The previous node for each node
 */
export default function bfs(graph, start, visited=undefined) {
    // Initial checks
    if (graph===undefined || start===undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // Get start node ref
    start = window.graph.nodes.find(node => node.id === start)

    // Initialize the variables
    const queue = [start]
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null]))  // Initialize the previous node for each node as null

    // If the visited object was not provided, create a new one with all the nodes set to false
    // The visited object represents the nodes that are already in the queue
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited and set the previous node as null
    visited[start] = true
    prevNode[start] = null

    // While the queue is not empty
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()

        // Add the node to the result
        result.push(node)

        // For each neighbor
        const neighbors = graph[node] || []
        for (const {dst} of neighbors) {
            if (!visited[dst]) {     // If the neighbor is not visited (visited represents the nodes that are already in the queue)
                queue.push(dst)      // Add the neighbor to the queue
                visited[dst] = true  // Mark the neighbor as visited
                prevNode[dst] = node // Save the current node as the previous node for the neighbor          
            }
        }
    }

    // Return the result, the visited nodes and the previous node for each node
    return {result, visited, prevNode}
}