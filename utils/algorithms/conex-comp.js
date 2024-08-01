import bfs from "./bfs"

export default function conexComps(graph) {
    // Initial checks
    if (graph === undefined) throw new Error('Invalid graph')

    // Initialize the connected components
    const conexComp = []
    const visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    // For each node in the graph
    for (const node in graph) {
        if (!visited[node]) {
            // Perform a BFS starting from the current node
            const {result} = bfs(graph, node, visited)
            conexComp.push(result)
        }
    }

    // Return the connected components
    return conexComp
}