export function generateGraphArray(){
    const graph = {}

    // Generate the nodes
    window.graph.nodes.forEach(node => {
        graph[node.id] = []
    })

    // Generate the edges
    window.graph.edges.forEach(edge => {
        // Edge format in the graph array: [src, dst, weight]
        const src = edge.src.id
        const dst = edge.dst.id
        const weight = edge.weight

        // Add the edge to the graph
        graph[edge.src.id].push([src, dst, weight])
        // Add the edge to the graph if it is not directed
        if (!edge.directed) graph[edge.dst.id].push([dst, src, weight])
    })

    return graph
}
    