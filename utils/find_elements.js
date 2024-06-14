import CONSTANTS from "./constants"

// Return the first occurrence of an element that contains the given coordinates
export function findNodeByCoords(x, y) {
    return window.graph.nodes.find(e => {
        return e.contains(x, y)
    })
}

// Return all nodes that contain the given coordinates
export function findNodesByCoords(x, y) {
    return window.graph.nodes.filter(e => {
        return e.contains(x, y)
    })
}

// Return the closest node from a list of nodes
export function closestHoverNode(){
    const x = window.cvs.x
    const y = window.cvs.y

    const nodes = findNodesByCoords(x, y)

    return nodes.reduce((acc, node) => {
        const dist = node.distanceToCenter(x, y)
        if (dist < acc.dist) return {node, dist}
        return acc
    }, {node: null, dist: Infinity}).node
}

// Find all edges that contain the given coordinates under a certain radius (EDGE_DETECTION_RADIUS)
export function findEdgesByCoords(x, y) {
    return window.graph.edges.filter(e => {
        return e.distance(x, y) <= 0
    })
}

export function closestHoverEdge(){
    const x = window.cvs.x
    const y = window.cvs.y

    const edges = findEdgesByCoords(x, y)

    return edges.reduce((acc, edge) => {
        const dist = edge.distance(x, y)
        if (dist < acc.dist) return {edge, dist}
        return acc
    }, {edge: null, dist: Infinity}).edge
}

// Find all elements that contain the given coordinates
export function findElementsByCoords(x, y) {
    return findNodesByCoords(x, y).concat(findEdgesByCoords(x, y))
}

export function findElementsByHover() {
    const result = []
    window.graph.nodes.forEach(node => {
        if (node.isHover()) result.push(node)
    })
    window.graph.edges.forEach(edge => {
        if (edge.isHover()) result.push(edge)
    })

    return result
}

// Find the closest element from a list of elements
export function closestHoverElement(){
    const x = window.cvs.x
    const y = window.cvs.y

    const elements = findElementsByHover()

    return elements.reduce((acc, element) => {
        const dist = element.distance(x, y)
        if (dist < acc.dist) return {element, dist}
        return acc
    }, {element: null, dist: Infinity}).element
}