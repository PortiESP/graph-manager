import { generateBranchesByPredecessors } from "./algorithms/algorithm_utils/convertions"
import { toposortKahn } from "./algorithms/toposort"
import constants from "./constants"


// ------------------------------- Helper functions -------------------------------
export function getNodeById(id){
    return window.graph.nodes.find(node => node.id == id)
}

// ------------------------------- Arrange functions -------------------------------

export function circularArrange(nodes){
    // Arrange the nodes in a sequence
    const numNodes = nodes.length
    const radius = constants.DEFAULT_NODE_RADIUS * 5
    const angle = 2 * Math.PI / numNodes
    const offset = (Math.PI / 2) + Math.PI  // Start at the top

    nodes.forEach((node, i) => {
        node.x = Math.cos(i * angle + offset) * radius + window.cvs.$canvas.width / 2
        node.y = Math.sin(i * angle + offset) * radius + window.cvs.$canvas.height / 2
    })
}

export function sequenceArrange(nodes){
    // Arrange the nodes in a sequence
    const margin = constants.DEFAULT_NODE_RADIUS * 5

    nodes.forEach((node, i) => {
        node.x = margin + i * margin
        node.y = window.cvs.$canvas.height / 2
    })
}



// toposort() >>> return { result, edges, hasCycle, remainingNodes, levels}
// levels = {node: level}
export function toposortArrange(g){
    const data = toposortKahn(g)
    const { levels } = data

    // Arrange the nodes in a sequence
    const margin = constants.DEFAULT_NODE_RADIUS * 5

    const cols = {}

    Object.entries(levels).forEach(([node, level]) => {
        if (level === null) return
        if (!cols[level]) cols[level] = []
        cols[level].push(node)
    })

    const nodes = Object.fromEntries(window.graph.nodes.map(node => [node.id, node]))

    Object.keys(cols).sort().forEach((col, i) => {
        cols[col].forEach((node, j) => {
            nodes[node].x = margin + i * margin
            nodes[node].y = margin + j * margin
        })
    })
}


export function treeArrange(data, all=false){
    const { result, prevNode } = data
    const branches = generateBranchesByPredecessors(prevNode)

    // Arrange the nodes in a sequence
    const margin = constants.DEFAULT_NODE_RADIUS * 5

    const i = 0
    const j = 0
    const visited = {}
    const matrix = {}
    let maxRow = -1

    const recBranch = (node, i, j) => {
        visited[node] = true
        matrix[node] = { row: i, col: j }

        // Update the max row
        maxRow = Math.max(maxRow, i)

        // Leaf node
        const branch = branches[node]
        if (!branch.length) return

        branch.forEach((child, k) => {
            recBranch(child, k===0 ? maxRow : maxRow+1, j+1)
        })
    }

    if (all) {
        for (const node in branches) 
            if (!visited[node]) recBranch(node, maxRow+1, j+1)
    } else {
        recBranch(result[0], 0, 0)
    }

    for (const node of data.result) {
        const { row, col } = matrix[node]
        node.x = margin + col * margin
        node.y = margin + row * margin
    }
}