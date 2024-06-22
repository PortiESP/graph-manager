import { Edge } from "../elements/edge";
import { Node } from "../elements/node";
import { setupGraphGlobals } from "../globals";
import constants from "./constants";

export function loadFromJSON(json) {
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Load the nodes
    const nodes = json.nodes.map(n => new Node(n.x, n.y, n.r, n.label))

    // Load the edges
    const edges = json.edges.map(e => {
        const src = nodes.find(n => n.label === e.src)
        const dst = nodes.find(n => n.label === e.dst)
        const directed = e.directed || false
        return new Edge(src, dst, e.weight, directed)
    })

    // Add the nodes and edges to the graph
    window.graph.nodes.push(...nodes)
    window.graph.edges.push(...edges)
}

// List of edges as a string 
/* Match the edge string using regex 
    - `src-{weight}->dst` ---> directed edge with weight
    - `src-{weight}-dst` ----> undirected edge with weight
    - `src->dst` ------------> directed edge with no weight
    - `src-dst` -------------> undirected edge with no weight
    - `src` -----------------> declare single node with no edges (not added to the edge list, but the node will be created)
*/
export function loadFromEdgePlainTextList(edgeList) {
    const createNode = (label) => {
        if (!nodes[label]) {
            nodes[label] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, label)
        }
    }
    
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    const edgesUnparsed = edgeList.split('\n')

    // Get nodes and edges from the edge list
    const nodes = {}
    const edges = []
    edgesUnparsed.forEach(edge => {
        edge = edge.trim()
        if (edge === '') return

        // Single node edge
        if (edge.match(/^\w+$/)) {
            createNode(edge)
            return
        }

        const { src, dst, weight, directed } = parseEdge(edge)

        // If the src node does not exist, create it
        createNode(src)
        // If the dst node does not exist, create it
        createNode(dst)

        // Create the edge object
        const srcNode = nodes[src]
        const dstNode = nodes[dst]
        edges.push(new Edge(srcNode, dstNode, weight, directed))
    })

    // Add the nodes and edges to the graph
    window.graph.nodes.push(...Object.values(nodes))
    window.graph.edges.push(...edges)
}

export function parseEdge(edgeString){
    const edgeRegex = /^(\w+)(?:-\{([\d.,]+)\})?->?(\w+)$/
    const match = edgeString.match(edgeRegex)
    if (match === null) {
        throw new Error(`Invalid edge string: ${edgeString}`)
    }

    const src = match[1]
    const weight = match[2] ? 
                    match[2].match(/[,.]/) ? 
                        parseFloat(match[2]) : 
                        parseInt(match[2]) :
                    undefined
    const dst = match[3]
    const directed = edgeString.includes('->')

    return { src, weight, dst, directed }    
}


// List of edges as a multidiemnsional array
export function loadFromEdgeArray(edgeArray, directed=false) {
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Get nodes and edges from the edge list
    const nodes = {}
    const edges = []
    edgeArray.forEach(edgeList => {
        edgeList.forEach(([src, dst, weight]) => {
            // If the src node does not exist, create it
            if (!nodes[src]) {
                nodes[src] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, src)
            }
            // If the dst node does not exist, create it
            if (!nodes[dst]) {
                nodes[dst] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, dst)
            }

            // Create the edge object
            const srcNode = nodes[src]
            const dstNode = nodes[dst]
            edges.push(new Edge(srcNode, dstNode, weight, directed))
        })
    })

    // Add the nodes and edges to the graph
    window.graph.nodes.push(...Object.values(nodes))
    window.graph.edges.push(...edges)
}
