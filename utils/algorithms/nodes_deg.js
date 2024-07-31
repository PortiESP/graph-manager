export default function nodes_deg(graph) {
    const nodes = graph.nodes;
    const edges = graph.edges;

    // Initialize degree object
    const deg = {};
    
    // Initialize degree of each node to 0
    nodes.forEach(node => deg[node.id] = 0);
    
    // Count the degree of each node
    edges.forEach(edge => {
        deg[edge.dst]++;
        !edge.directed && deg[edge.src]++;
    })
    
    return deg;
}
