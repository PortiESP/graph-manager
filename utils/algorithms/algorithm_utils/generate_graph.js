/**
 * Generate a graph array from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {Node: [Edge, ...], ...}
 */
export function generateGraphArray(){
    const graph = {
        nodes: [],
        edges: []
    }

    // Initialize the graph as an empty array for each node
    window.graph.nodes.forEach(node => {
        graph.nodes.push({x: node.x, y: node.y, label: node.label, r: node.r})
    })

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        const objEdge = {src: edge.src, dst: edge.dst}
        if(edge.weight !== undefined) objEdge.weight = edge.weight
        if(edge.directed) objEdge.directed = edge.directed
        graph.edges.push(objEdge)
    })

    return graph
}
    

export function generateEdgeList(){
    const edges = []

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        const w = edge.weight !== undefined ? `-${edge.weight}` : ""
        edges.push(`${edge.src}${w}-${edge.directed ? ">" : ""}${edge.dst}`)
    })

    return edges
}


export function generateEdgeAndNodesList(){
    const eList = generateEdgeList()
    const nList = window.graph.nodes.map(n => n.toString()).filter(n => !eList.join("").includes(n))
    return eList.concat(nList)
}


export function generateURL(){
    const url = new URL(window.location.href)
    const graph = generateEdgeAndNodesList().join("_")
    url.searchParams.set("graph", graph)

    return url.href
}