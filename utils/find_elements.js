/**
 * Return the first occurrence of an element that contains the given coordinates.
 * 
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Node} The first node that contains the given coordinates.
 */
export function findNodeByCoords(x, y) {
    return window.graph.nodes.find(e => {
        return e.contains(x, y)
    })
}

/**
 * Return all nodes that contain the given coordinates.
 * 
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Node[]} All nodes that contain the given coordinates.
 */
export function findNodesByCoords(x, y) {
    return window.graph.nodes.filter(e => {
        return e.contains(x, y)
    })
}

/**
 * Return the closest node from a list of nodes.
 *  
 * @returns {Node} The closest node from a list of nodes.
 */
export function closestHoverNode(){
    const x = window.cvs.x
    const y = window.cvs.y

    // Find all nodes that contain the given coordinates
    const nodes = findNodesByCoords(x, y)

    // Return the closest node
    return nodes.reduce((acc, node) => {
        const dist = node.distanceToCenter(x, y)
        if (dist < acc.dist) return {node, dist}
        return acc
    }, {node: null, dist: Infinity}).node
}

/**
 * Return the first occurrence of an edge that contains the given coordinates.
 * 
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Edge} The first edge that contains the given coordinates.
 */
export function findEdgesByCoords(x, y) {
    return window.graph.edges.filter(e => {
        return e.distance(x, y) <= 0
    })
}

/**
 * Return the closest edge from a list of edges.
 * 
 * @returns {Edge} The closest edge from a list of edges.
 */ 
export function closestHoverEdge(){
    const x = window.cvs.x
    const y = window.cvs.y

    // Find all edges that contain the given coordinates
    const edges = findEdgesByCoords(x, y)

    // Return the closest edge
    return edges.reduce((acc, edge) => {
        const dist = edge.distance(x, y)
        if (dist < acc.dist) return {edge, dist}
        return acc
    }, {edge: null, dist: Infinity}).edge
}

/**
 * Find all elements that contain the given coordinates.
 * 
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @returns {Element[]} All elements that contain the given coordinates.
 */
export function findElementsByCoords(x, y) {
    return findNodesByCoords(x, y).concat(findEdgesByCoords(x, y))
}

/**
 * Find all elements that are being hovered by the user.
 * 
 * @returns {Element[]} All elements that are being hovered by the user.
 */
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

/**
 * Find all elements that are being selected by the user.
 * 
 * @returns {Element[]} All elements that are being selected by the user.
 */
export function closestHoverElement(){
    const x = window.cvs.x
    const y = window.cvs.y

    // Find all elements that are being hovered by the user
    const elements = findElementsByHover()

    // Return the closest element
    return elements.reduce((acc, element) => {
        const dist = element.distance(x, y)
        if (dist < acc.dist) return {element, dist}
        return acc
    }, {element: null, dist: Infinity}).element
}