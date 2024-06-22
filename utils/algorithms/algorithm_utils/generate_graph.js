export function generateGraphArray(){
    const graph = {}

    // Generate the nodes
    window.graph.nodes.forEach(node => {
        graph[node] = []
    })

    // Generate the edges
    window.graph.edges.forEach(edge => {
        // Edge format in the graph array: [src, dst, weight]
        // Add the edge to the graph
        graph[edge.src].push(edge)
        // Add the edge to the graph if it is not directed
        if (!edge.directed) graph[edge.dst].push(edge)
    })

    return graph
}
    