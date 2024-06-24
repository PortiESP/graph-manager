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
export default function dfs(graph, start, visited = undefined) {
    if (graph === undefined || start === undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // Initialize the variables
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null])) // Initialize the previous node for each node as null

    // If the visited object was not provided, create a new one with all the nodes set to false
    // The visited object represents the nodes that has been explored and added to the result list
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited and set the previous node as null
    prevNode[start] = null

    const dfsRec = (node) => {
        // Add the current node to the result list
        result.push(node)

        // Mark the current node as visited
        visited[node] = true

        // Iterate over all the neighbors of the current node
        for (const {src, dst, weight} of graph[node]) {
            // If the neighbor has not been visited, call the function recursively
            if (!visited[dst]) {
                prevNode[dst] = src
                dfsRec(dst)
            }
        }
    }

    // Start the recursive function
    dfsRec(start)
    
    // Return the result, the visited nodes and the previous node for each node
    return { result, visited, prevNode }
}