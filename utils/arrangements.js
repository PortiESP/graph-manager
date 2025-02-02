import { generateSuccessorsByPredecessors } from "./algorithms/algorithm_utils/convertions"
import { generateAdjacencyList } from "./algorithms/algorithm_utils/generate_graph"
import bfs from "./algorithms/bfs"
import dfs from "./algorithms/dfs"
import { toposortKahn } from "./algorithms/toposort"
import constants from "./constants"
import { getBoundingBoxOfAllNodes } from "./view"


// ------------------------------- Helper functions -------------------------------
export function getNodeById(id){
    return window.graph.findNodeById(id)
}

// ------------------------------- Arrange functions -------------------------------
/**
 * Circular arrangement
 * 
 * Calculate the position of each node in a circular pattern
 * 
 * @param {Array} nodes Array of nodes
 */
export function circularArrange(nodes){
    // Arrange the nodes in a sequence
    const numNodes = nodes.length
    const radius = numNodes * constants.NODE_RADIUS  // The radius of the circle drawn by the nodes
    const angle = 2 * Math.PI / numNodes                     // The angle of separation between the nodes
    const offset = (Math.PI / 2) + Math.PI                   // Offset of the starting point (top of the circle)

    // Position the nodes
    nodes.forEach((node, i) => {
        const centerX = window.cvs.$canvas.width / 2
        const centerY = window.cvs.$canvas.height / 2
        node.x = centerX + Math.cos(i*angle + offset) * radius
        node.y = centerY + Math.sin(i*angle + offset) * radius
    })
}


/**
 * Sequence arrangement
 * 
 * Arrange the nodes one after the other in a horizontal line
 * 
 * @param {Array} nodes Array of nodes
 */
export function sequenceArrange(nodes){
    // Arrange the nodes in a sequence
    const margin = constants.NODE_RADIUS * 5

    // Position the nodes
    nodes.forEach((node, i) => {
        node.x = margin + i * margin            // Position the nodes horizontally
        node.y = window.cvs.$canvas.height / 2  // Center the nodes vertically
    })
}


/**
 * Toposort arrangement
 * 
 * Arrange the nodes in a topological order
 * 
 * @param {Object} g Graph represented as an adjacency list: {Node: [Edge, ...], ...]}
 */
export function toposortArrange(g){
    // Run the toposort algorithm
    const { levels, hasCycle, prevNode } = toposortKahn(g)

    if (hasCycle) return {hasCycle}

    // Used to position the nodes in columns based on the level
    const cols = {}  

    // Fill the `cols` object with the nodes corresponding to each level
    Object.entries(levels).forEach(([node, level]) => {
        // If the level is null, it means that the node was not visited (mostly due to a cycle)
        // In this case, we ignore the node (its position will not be updated)
        if (level === null) return

        // If the column is not set, create a new empty array
        if (!cols[level]) cols[level] = []
        // Add the node to the corresponding column
        cols[level].push(node)
    })

    // Create an object with the nodes id's as keys and the node objects as values
    const nodes = Object.fromEntries(window.graph.nodes.map(node => [node.id, node]))

    // Define some parameters
    const topMargin = constants.NODE_RADIUS * 5  // Define the top margin (initial space between the nodes and the top of the canvas: y=0)
    const leftMargin = constants.NODE_RADIUS * 5 // Define the left margin (initial space between the nodes and the left of the canvas: x=0)
    const hGap = constants.NODE_RADIUS * 5  // Define the horizontal space between the nodes (the distance between the columns)
    const vGap = constants.NODE_RADIUS * 4  // Define the vertical space between the nodes (the distance between the rows)

    // Arrange the nodes
    Object.keys(cols).forEach((col, i) => {
        cols[col].sort().forEach((node, j) => {
            nodes[node].x = topMargin + i * hGap
            nodes[node].y = leftMargin + j * vGap
        })
    })

    return {prevNode, levels}
}


/**
 * Tree arrangement
 * 
 * Arrange the nodes in a tree structure
 * 
 * @param {Array} nodes Array of nodes
 * @param {Object} prevsList Object representing the predecessors of each node: {Node: Node, ...}
 * @param {String} root Root node of the tree (optional) (if not passed, the tree is arranged from all possible roots)
 */
export function treeArrangeFromPrevsList(nodes, prevsList, root=undefined){
    // Generate the successors of each node based on the predecessors
    const succ = generateSuccessorsByPredecessors(prevsList)

    // Define some parameters
    const j = 0  // Initial column (used in the recursive function)
    const visited = {}  // Object to store the visited nodes
    const matrix = {}   // Object to store the position of each node
    let maxRow = -1  // Maximum row (used to calculate the bottom-most row so the next branch is placed as low as possible)

    // Recursive function to arrange the nodes
    const recBranch = (node, i, j) => {
        // If the node was already visited, return
        if (visited[node]) return

        // If the node is not visited, mark it as visited and store its position
        visited[node] = true  // Mark the current node as visited
        matrix[node] = { row: i, col: j }  // Store the position of the current node

        // Update the max row
        maxRow = Math.max(maxRow, i)

        // Get the children of the current node
        const children = succ[node]

        // If the node has no children (leaf), return
        if (!children.length) return

        // Make the recursive call for each child
        children.forEach((child, k) => {
            const newRow = k===0 ? // If it is the first child
                            i : // Keep the same row (this means that first child is placed in the same row as the parent, and the others are placed in the following rows)
                            Math.max(i+1, maxRow+1) // Place the following children in the last row (the bottom-most row) 
            const newCol = j + 1  // Increment the column  (the children of any node are placed in the next column)
            recBranch(child, newRow, newCol)
        })
    }

    // Make the first recursive call
    if (root === undefined) { // If no root is passed, make the recursive call for each node
        for (const node in succ) 
            if (!visited[node]) recBranch(node, maxRow+1, j+1)
    }
    // If a root is passed, make the recursive call for the root node
    else recBranch(root, 0, 0)

    // Define some parameters
    const topMargin = constants.NODE_RADIUS * 5  // Define the top margin (initial space between the nodes and the top of the canvas: y=0)
    const leftMargin = constants.NODE_RADIUS * 5 // Define the left margin (initial space between the nodes and the left of the canvas: x=0)
    const hGap = constants.NODE_RADIUS * 5  // Define the horizontal space between the nodes (the distance between the columns)
    const vGap = constants.NODE_RADIUS * 4  // Define the vertical space between the nodes (the distance between the rows)

    // Arrange the nodes
    for (const node of nodes) {
        const { row, col } = matrix[node]
        node.x = topMargin + col * hGap
        node.y = leftMargin + row * vGap
    }
}


/**
 * Tree arrangement
 * 
 * Arrange the nodes in a tree structure
 * 
 * This function is a wrapper for the `treeArrangeFromPrevsList` function. It generates the predecessors list and calls the function
 * 
 * @param {String} root Root node of the tree
 */
export function treeArrange(root, algorithm){
    // Generate the path
    let data;
    if (algorithm === "dfs") data = dfs(generateAdjacencyList(), root)
    else if (algorithm === "bfs") data = bfs(generateAdjacencyList(), root)

    // Arrange the nodes
    treeArrangeFromPrevsList(window.graph.nodes, data.prevNode, root)

    return data
}


/**
 * Organic arrangement
 * 
 * Arrange the nodes in the most natural way possible, avoiding edge crossings, nodes collisions, making clusters of related nodes, etc.
 * 
 * @param {Object} g Graph represented as an adjacency list: {Node: [Edge, ...], ...]}
 */
export function organicArrange(positioned=undefined){
    /**
     * The function will try to position the node in a circular pattern, avoiding collisions with other nodes, until a valid position is found.
     */
    const placeAround = (x, y, node) => {
        const degAngle = 30  // The angle of separation that will be tried at each iteration
        const angle = degAngle * Math.PI / 180 // Convert the angle to radians
        const slices = 360 / degAngle // Number of slices that will be tried before incrementing the radius
        const startAngle = Math.random() * 360 * Math.PI / 180 // Random starting angle
        let radius = constants.NODE_RADIUS * 5 // Initial radius

        // Try to position the node in a circular pattern, avoiding collisions with other nodes, until a valid position is found
        const startI = 0  // Initial slice
        let i = startI    // Current slice
        while (true){
            // Calculate the position of the node that will be tried
            node.x = x + Math.cos(startAngle + i*angle) * radius
            node.y = y + Math.sin(startAngle + i*angle) * radius
            // Check if the position is valid, if so, stop the loop since the node is already positioned
            if (validatePosition.every(check => check(node))) break

            // Increment the angle for the next try
            i = (i + 1) % slices
            // If the loop has already tried all the angles, increment the radius and try next ring
            if (i === startI) radius += constants.NODE_RADIUS * 2
        }

        // Mark the node as positioned
        positioned[node] = true
        // Add a function to the array that will avoid other nodes overlapping with this node
        validatePosition.push(otherNode => node.distance(otherNode.x, otherNode.y) > constants.NODE_RADIUS * 3)
    }

    // Obj of nodes with nodes as keys
    const nodes = window.graph.nodes
    const g = generateAdjacencyList()
    // Already positioned nodes
    if (positioned === undefined) positioned = {}
    // Array of funcitons that are created when a node is positioned in order avoid other nodes overlapping
    // Every function in the array must return true for the node to be positioned
    // Every function in the array takes the Node as a parameter
    const validatePosition = []
    Object.values(positioned).forEach(node => validatePosition.push(otherNode => node.distance(otherNode.x, otherNode.y) > constants.NODE_RADIUS * 3 || node.id === otherNode.id))
    
    // Position the nodes around the center of mass of the graph
    const {x1, y1, width, height} = getBoundingBoxOfAllNodes()
    const initX = x1 + width / 2  // Middle at the X axis
    const initY = y1 + height / 2 // Middle at the Y axis

    // Iterate over the nodes and position them in a circular pattern if possible
    for (const node of nodes){
        // If the node is already positioned, skip it
        if (!positioned[node]) placeAround(initX, initY, node)
        
        // Get the neighbors of the current node
        const neighbors = g[node].map(edge => edge.src === node ? edge.dst : edge.src)
        
        // Iterate over the neighbors and position the ones that are not already positioned in a circular pattern if possible
        neighbors.forEach((neighbor, i) => {
            // If the neighbor is already positioned, skip it
            if (positioned[neighbor]) return
            // Position the neighbor around the current node
            placeAround(node.x, node.y, neighbor)
        })
    }
}


/**
 * Random arrangement
 * 
 * Arrange the nodes in random positions
 * 
 * @param {Array} nodes Array of nodes
 */
export function randomArrange(nodes){
    // Arrange the nodes in random positions
    nodes.forEach((node, i) => {
        node.x = Math.random() * window.cvs.$canvas.height
        node.y = Math.random() * window.cvs.$canvas.height
    })
}


/**
 * Grid arrangement
 * 
 * Arrange the nodes in a grid pattern
 * 
 * @param {Array} nodes Array of nodes
 */
export function gridArrange(nodes){
    // Arrange the nodes in a grid pattern
    const margin = constants.NODE_RADIUS * 5
    const cols = Math.ceil(Math.sqrt(nodes.length))
    nodes.forEach((node, i) => {
        node.x = margin + (i % cols) * margin
        node.y = margin + Math.floor(i / cols) * margin
    })
}