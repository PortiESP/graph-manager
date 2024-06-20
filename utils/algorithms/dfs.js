export function dfs(graph, start, visited = {}) {
    // Create a stack and add the start node
    const stack = [start]
    const result = []
    const edges = []

    // Mark the start node as visited
    visited[start] = true 

    // While the stack is not empty
    while (stack.length) {
        // Get the last element of the stack
        const node = stack.pop()
        result.push(node)

        // Get the neighbors of the node
        const neighbors = graph[node] || []

        // For each neighbor
        for (const [src, dst, weight] of neighbors) {
            if (!visited[dst]) {  // If the neighbor was not visited (visited represents the nodes that are already in the stack)
                stack.push(dst)
                visited[dst] = true  // Mark the node as visited (in the stack)

                // Add the edge to the result edges list
                edges.push([src, dst, weight])
            }
        }
    }

    return {result, edges, visited}
}