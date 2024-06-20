/* 
    graph = {A: [(src, dst, weight), ...], B: [...], ...} 
*/

export default function bfs(graph, start, visited = {}) {
    // Create a queue and add the start node
    const queue = [start]
    const result = []
    const edges = []

    // Mark the start node as visited
    visited[start] = true

    // While the queue is not empty
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()
        result.push(node)

        // Get the neighbors of the node
        const neighbors = graph[node] || []

        // For each neighbor
        for (const [src, dst, weight] of neighbors) {
            if (!visited[dst]) {  // If the neighbor was not visited (visited represents the nodes that are already in the queue)
                queue.push(dst)
                visited[dst] = true  // Mark the node as visited (in the queue)

                // Add the edge to the result edges list
                edges.push([src, dst, weight])
            }
        }
    }

    return {result, edges, visited}
}