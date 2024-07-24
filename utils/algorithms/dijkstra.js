/**
 * Dijkstra's algorithm for finding the shortest paths between nodes in a graph.
 * 
 * - The algorithm will visit all the nodes accessible from the start node in the graph.
 * 
 * @param {Object} graph Graph represented as an adjacency list: {Node: [Edge, ...], ...]}
 * @param {String} start Start node. The node must be a key in the graph object
 * @param {Object} visited Object to store the visited nodes. The object must have the same keys as the graph object and the values must be booleans
 * @returns {Object} An object where the Node(s) are the key and the value an object with the following properties:
 * - distance: The distance from the start node to the node
 * - prevNode: The previous node for each node
 */
export default function dijkstra(graph, start, visited=undefined) {
    // Initial checks
    if (graph===undefined || start===undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // Initialize the variables
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, undefined]))  // Initialize the previous node for each node as null
    const distance = Object.fromEntries(Object.keys(graph).map(node => [node, Infinity]))  // Initialize the distance for each node as Infinity

    // If the visited object was not provided, create a new one with all the nodes set to false
    // The visited object represents the nodes that are already in the queue
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited and set the previous node as null
    prevNode[start] = null
    distance[start] = 0

    const getBest = () => {
        let best = null
        let bestDistance = Infinity
        for (const node in visited) {
            if (!visited[node] && distance[node] < bestDistance) {
                best = node
                bestDistance = distance[node]
            }
        }
        return best
    }

    // While the queue is not empty
    while (true) {
        // Get the first element of the queue
        const node = getBest()
        
        if (node === null) break

        visited[node] = true  // Mark the neighbor as visited

        // For each neighbor
        const neighbors = graph[node] || []
        for (const {dst, weight} of neighbors) {
            if (!visited[dst]) {     // If the neighbor is not visited (visited represents the nodes that are already in the queue)
                const newDistance = distance[node] + weight
                if (newDistance < distance[dst]) {
                    distance[dst] = newDistance
                    prevNode[dst] = node // Save the current node as the previous node for the neighbor
                }
            }
        }
    }

    // Return the result, the visited nodes and the previous node for each node
    return Object.fromEntries(Object.keys(graph).map(node => [node, {distance: distance[node], prevNode: prevNode[node]}]))
}