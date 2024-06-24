import { generateSuccessorsByPredecessors } from "./algorithms/algorithm_utils/convertions"
import dfs from "./algorithms/dfs"
import { toposortKahn } from "./algorithms/toposort"
import constants from "./constants"


// ------------------------------- Helper functions -------------------------------
export function getNodeById(id){
    return window.graph.nodes.find(node => node.id == id)
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
    const radius = numNodes * constants.DEFAULT_NODE_RADIUS  // The radius of the circle drawn by the nodes
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
    const margin = constants.DEFAULT_NODE_RADIUS * 5

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
    const { levels } = toposortKahn(g)

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
    const topMargin = constants.DEFAULT_NODE_RADIUS * 5  // Define the top margin (initial space between the nodes and the top of the canvas: y=0)
    const leftMargin = constants.DEFAULT_NODE_RADIUS * 5 // Define the left margin (initial space between the nodes and the left of the canvas: x=0)
    const hGap = constants.DEFAULT_NODE_RADIUS * 5  // Define the horizontal space between the nodes (the distance between the columns)
    const vGap = constants.DEFAULT_NODE_RADIUS * 4  // Define the vertical space between the nodes (the distance between the rows)

    // Arrange the nodes
    Object.keys(cols).sort().forEach((col, i) => {
        cols[col].forEach((node, j) => {
            nodes[node].x = topMargin + i * hGap
            nodes[node].y = leftMargin + j * vGap
        })
    })
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
    const topMargin = constants.DEFAULT_NODE_RADIUS * 5  // Define the top margin (initial space between the nodes and the top of the canvas: y=0)
    const leftMargin = constants.DEFAULT_NODE_RADIUS * 5 // Define the left margin (initial space between the nodes and the left of the canvas: x=0)
    const hGap = constants.DEFAULT_NODE_RADIUS * 5  // Define the horizontal space between the nodes (the distance between the columns)
    const vGap = constants.DEFAULT_NODE_RADIUS * 4  // Define the vertical space between the nodes (the distance between the rows)

    // Arrange the nodes
    for (const node of nodes) {
        const { row, col } = matrix[node]
        node.x = topMargin + col * hGap
        node.y = leftMargin + row * vGap
    }
}


export function treeArrange(g, root){
    // Generate the path
    const data = dfs(g, root)

    // Arrange the nodes
    treeArrangeFromPrevsList(window.graph.nodes, data.prevNode, root)
}