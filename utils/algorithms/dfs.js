/**
 * Depth-first search algorithm
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
export default function dfs(graph, start, visited=undefined) {
    if (graph===undefined || start===undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // Initialize the variables
    const stack = [start]
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null])) // Initialize the previous node for each node as null

    // If the visited object was not provided, create a new one with all the nodes set to false
    // The visited object represents the nodes that has been explored and added to the result list
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited and set the previous node as null
    visited[start] = true 
    prevNode[start] = null

    // While the stack is not empty
    while (stack.length) {
        // Get the last element of the stack (top of the stack)
        const node = stack.pop()

        // Mark the node as visited (explored and added to the result list)
        visited[node] = true  
        // Add the node to the result
        result.push(node)

        // Get the neighbors of the node
        const neighbors = graph[node] || []
        for (const {src, dst, weight} of neighbors) {
            if (!visited[dst]) {     // If the neighbor is not visited (visited represents the nodes that has been explored and added to the result list)
                stack.push(dst)      // Add the neighbor to the stack
                prevNode[dst] = node // Save the previous node
            }
        }
    }

    // Return the result, the visited nodes and the previous node for each node
    return {result, visited, prevNode}
}