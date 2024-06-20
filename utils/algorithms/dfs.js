export function dfs(graph, start, visited) {
    if (!graph || !start) throw new Error('Invalid graph or start node')


    // Create a stack and add the start node
    const stack = [start]
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null]))
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // Mark the start node as visited and set the previous node as null
    visited[start] = true 
    prevNode[start] = null

    // While the stack is not empty
    while (stack.length) {
        // Get the last element of the stack
        const node = stack.pop()
        result.push(node)

        // Get the neighbors of the node
        const neighbors = graph[node] || []
        for (const [src, dst, weight] of neighbors) {
            if (!visited[dst]) {  // If the neighbor was not visited (visited represents the nodes that are already in the stack)
                stack.push(dst)
                visited[dst] = true  // Mark the node as visited (in the stack)
                
                // Add the edge to the result edges list
                prevNode[dst] = node // Save the previous node
            }
        }
    }

    return {result, visited, prevNode}
}