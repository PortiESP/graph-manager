import { dfs } from "./dfs"

export default function toposortDFS(graph) {
    // Create a stack and add the start node
    const stack = []
    let visited = {}
    const result = []
    const edges = [] // Add edges variable to store the edges of the result

    // For each node in the graph
    for (const node in graph) {
        if (!visited[node]) {
            const { result: dfsResult, edges: dfsEdges, visited: dfsVisited } = dfs(graph, node, visited)
            stack.push(...dfsResult)
            edges.push(...dfsEdges)
            visited = dfsVisited
        }
    }

    // Reverse the stack to get the topological order
    while (stack.length) {
        result.push(stack.pop())
    }

    return { result, edges }
}
export function toposortKahn(graph) {
    const inDegree = {}
    const result = []
    const edges = [] // Add edges variable to store the edges of the result
    const queue = []

    // Initialize the inDegree of all nodes
    for (const node in graph) {
        inDegree[node] = 0
    }

    // Calculate the inDegree of all nodes
    for (const node in graph) {
        for (const [src, dst, w] of graph[node]) {
            inDegree[dst]++
        }
    }

    // Add all nodes with inDegree 0 to the queue
    for (const node in inDegree) {
        if (inDegree[node] === 0) {
            queue.push(node)
        }
    }

    // While the queue is not empty
    while (queue.length) {
        const node = queue.shift()
        result.push(node)

        // For each neighbor of the node
        for (const [src, dst, w] of graph[node]) {
            inDegree[dst]--

            // If the dst has inDegree 0, add it to the queue
            if (inDegree[dst] === 0) {
                queue.push(dst)
            }
            edges.push([src, dst, w]) // Add the edge to the edges array
        }
    }

    // If the result length is different from the graph length, there is a cycle
    const hasCycle = result.length !== Object.keys(graph).length
    const remainingNodes = Object.keys(graph).filter(node => !result.includes(node))

    return { result, edges, hasCycle, remainingNodes}
}