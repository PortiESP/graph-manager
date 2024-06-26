/**
 * Generate a graph array from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {Node: [Edge, ...], ...}
 */
export function generateGraphArray(){
    const graph = {}

    // Initialize the graph as an empty array for each node
    window.graph.nodes.forEach(node => {
        graph[node] = []
    })

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        graph[edge.src].push(edge)

        // Add the edge also to the destination node if the edge is not directed
        if (!edge.directed) {
            // Clone the edge and swap the src and dst
            const newE = edge.clone()
            newE.src = edge.dst
            newE.dst = edge.src

            // Add the new edge to the graph
            graph[edge.dst].push(newE)
        }
    })

    return graph
}
    

export function generateEdgeList(){
    const edges = []

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        const w = edge.weight !== undefined ? `-{${edge.weight}}` : ""
        edges.push(`${edge.src}${w}-${edge.directed ? ">" : ""}${edge.dst}`)
    })

    return edges
}