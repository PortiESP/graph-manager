import { Edge } from "../elements/edge";
import { Node } from "../elements/node";
import constants from "./constants";

/**
 * Load a graph from a JSON string or JS object
 * 
 * The JSON object must have the following structure:
 * ```json
 * {
 *    "nodes": [
 *       {"x": 0, "y": 0, "r": 30, "id": "A"},
 *       {"x": 100, "y": 0, "r": 30, "id": "B"},
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
 * @param {boolean} append - A boolean indicating if the graph should be appended to the current graph or if it should be replaced
 */
export function loadFromJSON(json, append = false) {


    // Reset the graph to its initial state
    if (append === false) window.graph.reset()

    // Parse the JSON string if needed
    if (typeof json === 'string') {
        json = JSON.parse(json)
    }

    if (!validateJSON(json)) throw new Error("Invalid JSON Object")

    // Load the nodes
    const nodes = json.nodes.map(n => {
        const auxNode = new Node()
        Object.assign(auxNode, n)

        // If no label is provided, use the id as the label
        if (n.label === undefined) auxNode.label = auxNode.id

        // If the node being loaded is selected, reset the selected property and trigger the select method
        if (n.selected) window.graph.pushSelected(auxNode)

        return auxNode
    })

    // Load the edges
    const edges = json.edges.map(e => {
        // Find the source and destination nodes
        const src = nodes.find(n => n.id === e.src)
        const dst = nodes.find(n => n.id === e.dst)
        // Create the edge object
        const auxEdge = new Edge()

        // Assign all the properties of the edge
        Object.assign(auxEdge, e)

        // Reassign the source and destination nodes
        auxEdge.src = src
        auxEdge.dst = dst

        // If the edge being loaded is selected, reset the selected property and trigger the select method
        if (e.selected) window.graph.pushSelected(auxEdge)

        return auxEdge
    })

    // Add the nodes and edges to the graph
    window.graph.pushNode(...nodes)
    window.graph.pushEdge(...edges)
}


/**
 * Validate a JSON object
 * 
 * A JSON object is valid if it has the following properties:
 * - nodes: An array of nodes
 * - edges: An array of edges
 * 
 * Each node must have the following properties:
 * - id: The id of the node
 * - x: The x coordinate of the node
 * - y: The y coordinate of the node
 * - r: The radius of the node
 * 
 * Each edge must have the following properties:
 * - src: The source node id
 * - dst: The destination node id
 * 
 * @param {Object} data - The JSON object to validate
 * 
 * @returns {boolean} True if the JSON object is valid, false otherwise
 */
export function validateJSON(data) {
    // Convert the JSON string to an object if needed
    if (typeof data == 'string') try{data = JSON.parse(data)} catch(e) {return false}

    // Check if the object has the nodes and edges properties
    if (!data.nodes || !data.edges) return false
    // Check if the nodes and edges properties are arrays
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false

    // - Functions -
    // Check if the nodes have the required properties
    function validateNode(node) {
        if ((node.id ?? node._id) === undefined) return false     // Missing id
        if ((node.x ?? node._x) === undefined) return false       // Missing x
        if ((node.y ?? node._y) === undefined) return false       // Missing y
        if ((node.r ?? node._r) === undefined) return false       // Missing r
        if ((node.id ?? node._id).includes(' ')) return false  // IDs cannot contain spaces
        return true
    }
    // Check if the edges have the required properties
    function validateEdge(edge) {
        if (!(edge.src ?? edge._src)) return false  // Missing src
        if (!(edge.dst ?? edge._dst)) return false  // Missing dst
        return true
    }

    // Check if the nodes and edges are valid
    if (data.nodes.some(e => !validateNode(e))) return false
    if (data.edges.some(e => !validateEdge(e))) return false

    return true
}


/**
 * Load a graph from a plain text edge list
 * 
 * Each line of represents an edge in the graph, or a single node.
 * 
 * The lines must follow one of the following formats:
 * - `src weight>dst` ---> directed edge with weight
 * - `src weight dst` ----> undirected edge with weight
 * - `src>dst` ------------> directed edge with no weight
 * - `src dst` -------------> undirected edge with no weight
 * - `src` -----------------> declare single node with no edges (not added to the edge list, but the node will be created)
 * 
 * @param {string} edgeList - The edge list as a string: `src-{weight}->dst\nsrc->dst\nsrc-dst\nsrc`
 */
export function loadFromEdgePlainTextList(edgeList, reuseNodes = undefined) {

    // Function to create a node if it does not exist
    const createNode = (label) => {
        if (reuseNodes && reuseNodes[label]) nodes[label] = reuseNodes[label]
        if (!nodes[label]) {
            nodes[label] = new Node(undefined, undefined, label, constants.NODE_RADIUS)
        }
    }

    // Reset the graph to its initial state
    window.graph.reset()

    // If the edge list is empty, return
    if (edgeList === '') return

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
    window.graph.pushNode(...Object.values(nodes))
    window.graph.pushEdge(...edges)
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
export function parseEdge(edgeString) {
    // Regular expression to match the edge string
    const edgeRegex = /^(\w+)(?: ([\d.,]+))?[ >](\w+)$/
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
    const directed = edgeString.includes('>')

    return { src, weight, dst, directed }
}


/**
 * Check if an edge string is valid
 * 
 * An edge string is valid if it is a single node edge or a valid edge string.
 * 
 * @param {string} edgeString - The edge string
 * @returns {boolean} True if the edge string is valid, false otherwise
 */
export function isValidElement(edgeString) {
    // Single node edge
    if (isSingleNodeEdge(edgeString)) return true

    // Parse the line to extract the edge data
    return parseEdge(edgeString) !== null
}


/**
 * Check if an edge string is a single node edge
 * 
 * A single node edge is a string containing only one word.
 * 
 * @param {string} edgeString - The edge string
 * @returns {boolean} True if the edge string is a single node edge, false otherwise
 */
export function isSingleNodeEdge(edgeString) {
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
export function loadFromEdgeArray(edgeArray, directed = false) {
    // Reset the graph to its initial state
    window.graph.reset()

    // Get nodes and edges from the edge list
    const nodes = {}
    const edges = []
    edgeArray.forEach(edgeList => {
        edgeList.forEach(([src, dst, weight]) => {
            // If the src node does not exist, create it
            if (!nodes[src]) nodes[src] = new Node(0, 0, src, constants.NODE_RADIUS)
            // If the dst node does not exist, create it
            if (!nodes[dst]) nodes[dst] = new Node(0, 0, dst, constants.NODE_RADIUS)

            // Create the edge object
            const srcNode = nodes[src]
            const dstNode = nodes[dst]
            edges.push(new Edge(srcNode, dstNode, weight, directed))
        })
    })

    // Add the nodes and edges to the graph
    window.graph.pushNode(...Object.values(nodes))
    window.graph.pushEdge(...edges)
}


/**
 * Load a graph from a URL
 * 
 * The URL must contain the graph data as a query parameter named `graph`. The graph data must be a plain text edge list separated by underscores.
 * 
 * @param {string} url - The URL containing the graph data
 */
export function loadFromURL(url) {
    if (!validateURL(url)) throw new Error("Invalid URL")

    const parsedURL = new URL(url)
    const graph = parsedURL.searchParams.get("graph")

    loadFromEdgePlainTextList(graph.replaceAll("_", "\n"))
}


/**
 * Validate a URL
 * 
 * A URL is valid if it contains the graph query parameter.
 * 
 * @param {string} url - The URL to validate
 * 
 * @returns {boolean} True if the URL is valid, false otherwise
 */
export function validateURL(url) {
    let parsedURL
    try {parsedURL = new URL(url)} catch(e) {return false}

    const g = parsedURL.searchParams.get("graph")

    // Check if the URL contains the graph query parameter
    if (g === null || g === undefined) return false
    // Check if the host is valid
    if (parsedURL.host !== location.host) return false

    return true
}