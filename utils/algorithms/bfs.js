/* 
    graph = {A: [(src, dst, weight), ...], B: [...], ...} 
*/

export default function bfs(graph, start, visited) {
    if (!graph || !start) throw new Error('Invalid graph or start node')

    // Create a queue and add the start node
    const queue = [start]
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null]))
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited
    visited[start] = true
    prevNode[start] = null

    // While the queue is not empty
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()
        result.push(node)

        // For each neighbor
        const neighbors = graph[node] || []
        for (const [src, dst, weight] of neighbors) {
            if (!visited[dst]) {  // If the neighbor was not visited (visited represents the nodes that are already in the queue)
                queue.push(dst)
                visited[dst] = true  // Mark the node as visited (in the queue)
                prevNode[dst] = node // Save the previous node                
            }
        }
    }

    return {result, visited, prevNode}
}