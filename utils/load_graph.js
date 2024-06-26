import { Edge } from "../elements/edge";
import { Node } from "../elements/node";
import { setupGraphGlobals } from "../globals";
import constants from "./constants";

/**
 * Load a graph from a JSON string or JS object
 * 
 * The JSON object must have the following structure:
 * ```json
 * {
 *    "nodes": [
 *       {"x": 0, "y": 0, "r": 30, "label": "A"},
 *       {"x": 100, "y": 0, "r": 30, "label": "B"},
 *       ...
 *    ],
 *    "edges": [
 *       {"src": "A", "dst": "B", "weight": 1, "directed": true},
 *       {"src": "B", "dst": "C", "weight": 2, "directed": false},
 *       ...
 *    ]
 * }
 * ```
 * 
 * @param {Object} json - The JSON object
 * 
 */
export function loadFromJSON(json) {
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Parse the JSON string if needed
    if (typeof json === 'string') {
        json = JSON.parse(json)
    }

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


/**
 * Load a graph from a plain text edge list
 * 
 * Each line of represents an edge in the graph, or a single node.
 * 
 * The lines must follow one of the following formats:
 * - `src-{weight}->dst` ---> directed edge with weight
 * - `src-{weight}-dst` ----> undirected edge with weight
 * - `src->dst` ------------> directed edge with no weight
 * - `src-dst` -------------> undirected edge with no weight
 * - `src` -----------------> declare single node with no edges (not added to the edge list, but the node will be created)
 * 
 * @param {string} edgeList - The edge list as a string: `src-{weight}->dst\nsrc->dst\nsrc-dst\nsrc`
 */
export function loadFromEdgePlainTextList(edgeList) {
    // Function to create a node if it does not exist
    const createNode = (label) => {
        if (!nodes[label]) {
            nodes[label] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, label)
        }
    }
    
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Split the edge list by lines
    const edgesUnparsed = edgeList.split('\n')

    // Get nodes and edges from the edge list
    const nodes = {}
    const edges = []
    edgesUnparsed.forEach(edge => {
        edge = edge.trim() // Remove leading and trailing spaces

        // Skip empty lines
        if (edge === '') return

        // Single node edge
        if (edge.match(/^\w+$/)) {
            createNode(edge)
            return // Skip to the next edge
        }

        // Parse the line to extract the edge data
        const { src, dst, weight, directed } = parseEdge(edge)

        // Before creating the edge, check if the nodes exist
        // If the src and dst nodes does not exist, create them
        createNode(src)
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


/**
 * Parse an edge string to extract the source, destination and weight
 * 
 * @param {string} edgeString - The edge string
 * @returns {Object} An object with the following properties:
 * - src: The source node
 * - weight: The weight of the edge (if any)
 * - dst: The destination node
 * - directed: A boolean indicating if the edge is directed
 */
export function parseEdge(edgeString){
    // Regular expression to match the edge string
    const edgeRegex = /^(\w+)(?:-\{([\d.,]+)\})?->?(\w+)$/
    // Evaluate the regex
    const match = edgeString.match(edgeRegex)

    // If the edge string does not match the regex, throw an error
    if (match === null) return null

    // If the edge string matches the regex, extract the data

    // Extract the source, weight, destination and directed properties
    const src = match[1]
    const weight = match[2] ? // If the weight is defined, try to parse it as a float, otherwise parse it as an integer
                    match[2].match(/[,.]/) ? 
                        parseFloat(match[2]) : 
                        parseInt(match[2]) :
                    undefined
    const dst = match[3]
    // The edge is directed if the string contains the '->' substring
    const directed = edgeString.includes('->')

    return { src, weight, dst, directed }    
}


// Check if an edge string is valid (valid single node edge or valid edge string)
export function isValidEdge(edgeString){
    // Single node edge
    if (isSingleNodeEdge(edgeString)) return true

    // Parse the line to extract the edge data
    return parseEdge(edgeString) !== null
}


export function isSingleNodeEdge(edgeString){
    return edgeString.match(/^\w+$/) !== null
}


/**
 * Load a graph from an edge list as a multidimensional array
 * 
 * Each element of the array represents an edge in the graph.
 * 
 * The array must follow the following structure:
 * ```js
 * [
 *      [['src', 'dst', weight], ['src', 'dst', weight], ...],
 *      [['src', 'dst', weight], ['src', 'dst', weight], ...]
 * ]
 * ```
 * 
 * @param {Array} edgeArray - The edge list as a multidimensional array
 * @param {boolean} directed - A boolean indicating if the edges are directed
 */
export function loadFromEdgeArray(edgeArray, directed=false) {
    // Clear the current graph and reset all the graph global variables
    setupGraphGlobals()

    // Get nodes and edges from the edge list
    const nodes = {}
    const edges = []
    edgeArray.forEach(edgeList => {
        edgeList.forEach(([src, dst, weight]) => {
            // If the src node does not exist, create it
            if (!nodes[src]) nodes[src] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, src)
            // If the dst node does not exist, create it
            if (!nodes[dst]) nodes[dst] = new Node(0, 0, constants.DEFAULT_NODE_RADIUS, dst)

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
