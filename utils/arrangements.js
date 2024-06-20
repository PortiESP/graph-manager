import constants from "./constants"

export function circularArrange(){
    // Arrange the nodes in a sequence
    const nodes = window.graph.nodes
    const numNodes = nodes.length
    const radius = constants.DEFAULT_NODE_RADIUS * 5
    const angle = 2 * Math.PI / numNodes
    const offset = (Math.PI / 2) + Math.PI  // Start at the top

    nodes.forEach((node, i) => {
        node.x = Math.cos(i * angle + offset) * radius + window.cvs.$canvas.width / 2
        node.y = Math.sin(i * angle + offset) * radius + window.cvs.$canvas.height / 2
    })
}

export function sequenceArrange(){
    // Arrange the nodes in a sequence
    const nodes = window.graph.nodes
    const margin = constants.DEFAULT_NODE_RADIUS * 5

    nodes.forEach((node, i) => {
        node.x = margin + i * margin
        node.y = window.cvs.$canvas.height / 2
    })
}