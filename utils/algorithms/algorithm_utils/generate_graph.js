import constants from "../../constants"
import { getBoundingBoxOfAllNodes } from "../../view"

/**
 * Generate an array from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {Node: [Edge, ...], ...}
 */
export function generateEdgeArray(){
    const graph = {}

    // Initialize the graph as an empty array for each node
    window.graph.nodes.forEach(node => {
        graph[node] = []
    })

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        graph[edge.src].push(edge)

        // Add the edge also to the destination node if the edge is not directed
        if (!edge.directed) {
            // Clone the edge and swap the src and dst
            const newE = edge.clone()
            newE.src = edge.dst
            newE.dst = edge.src

            // Add the new edge to the graph
            graph[edge.dst].push(newE)
        }
    })

    return graph
}


/**
 * Generate an object from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {nodes: [{}, ...], edges: [{}, ...]}
 * - nodes: `{x, y, label, r}`
 * - edges: `{src, dst, weight, directed}`
 */
export function generateGraphObject(){
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
        const objEdge = {src: edge.src.id, dst: edge.dst.id}
        if(edge.weight !== undefined) objEdge.weight = edge.weight
        if(edge.directed) objEdge.directed = edge.directed
        graph.edges.push(objEdge)
    })

    return graph
}
    

/**
 * Generate an array of edges strings from the graph
 * 
 * The array contains the edges in the format: 
 * - `src-weight-dst` if the edge has a weight
 * - `src-weight->dst` if the edge has a weight and is directed
 * - `src->dst` if the edge is directed (default weight is 1)
 * - `src-dst` if the edge is not directed (default weight is 1)
 * 
 * @returns {Array} 
 */
export function generateEdgeList(){
    const edges = []

    // Fill the graph with the edges
    window.graph.edges.forEach(edge => {
        // Add the edge to the graph
        const w = edge.weight > 1 ? `-${edge.weight}` : ""
        edges.push(`${edge.src}${w}-${edge.directed ? ">" : ""}${edge.dst}`)
    })

    return edges
}


/**
 * Generate a string representation of the graph (including the nodes and edges)
 * 
 * Edges are represented as shown in the `generateEdgeList` function, and nodes are represented as their ID
 * 
 * @returns {string} A string representation of the graph
 */
export function generateEdgeAndNodesList(){
    // Generate edges
    const eList = generateEdgeList()
    // Generate nodes
    const nList = window.graph.nodes.map(n => n.toString()).filter(n => !eList.join("").includes(n))
    // Concatenate the lists
    return eList.concat(nList)
}


/**
 * Generate a URL representation of the graph
 * 
 * The URL contains the graph data in the query string "graph=...". The edges and nodes are separated by an underscore `_`
 * 
 * Since the URL is encoded, the characters ">" is replaced by "%3E"
 * 
 * @returns {string} The URL with the graph data
 */
export function generateURL(){
    // Generate a URL object from the current URL
    const url = new URL(window.location.origin)
    // Generate the graph data
    const graph = generateEdgeAndNodesList().join("_")
    // Edit the URL object to include the graph data in the query string
    url.searchParams.set("graph", graph)

    // Return the URL as a string with the graph data in the query string
    return url.href
}


/**
 * Generate a SVG representation of the graph
 * 
 * The SVG is generated from the graph global object and the nodes and edges are styled according to the global object
 */
export function generateSVG(){
    const svg = document.createElement("svg")
    const svgNS = "http://www.w3.org/2000/svg"
    const xlinkns = "http://www.w3.org/1999/xlink"

    // Set the SVG attributes
    svg.setAttribute("xmlns", svgNS)
    svg.setAttribute("xmlns:xlink", xlinkns)
    svg.setAttribute("version", "1.1")
    const {x1, y1, width, height} = getBoundingBoxOfAllNodes()
    const margin = 1
    svg.setAttribute("viewBox", `${x1-margin} ${y1-margin} ${width+margin*2} ${height+margin*2}`)

    // Create the defs element
    const defs = document.createElementNS(svgNS, "defs")
    svg.appendChild(defs)

    // Create the style element
    const style = document.createElementNS(svgNS, "style")

    style.textContent = generateCSS()
    defs.appendChild(style)

    const nodes = []
    const nodesLabels = []
    const edges = []
    const edgesLabels = []


    // Create the edges
    window.graph.edges.forEach(edge => {
        let {src, dst} = edge.nodesIntersectionBorderCoords()
        
        // Create the label for the edge's weight
        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("class", "weight")
        text.setAttribute("x", (src.x + dst.x) / 2)
        text.setAttribute("y", (src.y + dst.y) / 2)
        text.setAttribute("id", "weight-"+edge.id)
        text.textContent = edge.weight
        edgesLabels.push(text)
        
        // Create the box for the edge's weight
        const textBox = document.createElementNS(svgNS, "rect")
        textBox.setAttribute("class", "weight_box")
        const centerX = (src.x + dst.x) / 2
        const centerY = (src.y + dst.y) / 2
        const fontSize = edge.weightFontSize
        const boxSize = constants.EDGE_WEIGHT_BOX_SIZE + String(edge.weight).length * 4
        textBox.setAttribute("x", centerX - boxSize)
        textBox.setAttribute("y", centerY - fontSize*0.75)
        textBox.setAttribute("width", boxSize*2)
        textBox.setAttribute("height", fontSize*1.25)
        textBox.setAttribute("id", "box-"+edge.id)
        edgesLabels.push(textBox)

        if (edge.directed){
            const arrowSize = edge.thickness * edge.arrowSizeFactor
            const {dst: dstDir, angle} = edge.nodesIntersectionBorderCoords(0, arrowSize*0.8)
            const arrowAngle = Math.PI / 6

            // Create the line for the edge
            const line = document.createElementNS(svgNS, "line")
            line.setAttribute("class", "edge")
            line.setAttribute("x1", src.x)
            line.setAttribute("y1", src.y)
            line.setAttribute("x2", dstDir.x)
            line.setAttribute("y2", dstDir.y)
            line.setAttribute("stroke", edge.color)
            line.setAttribute("id", edge.id)
            edges.push(line)

            const p1 = {x: dst.x, y: dst.y}
            const p2 = {x: dst.x - arrowSize * Math.cos(angle - arrowAngle), y: dst.y - arrowSize * Math.sin(angle - arrowAngle)}
            const p3 = {x: dst.x - arrowSize * Math.cos(angle + arrowAngle), y: dst.y - arrowSize * Math.sin(angle + arrowAngle)}

            // Create the arrow for the edge
            const arrow = document.createElementNS(svgNS, "polygon")
            arrow.setAttribute("class", "edge")
            arrow.setAttribute("points", `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`)
            arrow.setAttribute("fill", edge.color)
            arrow.setAttribute("id", "edge-arrow-"+edge.id)
            edges.push(arrow)

        } else {
            // Create the line for the edge
            const line = document.createElementNS(svgNS, "line")
            line.setAttribute("class", "edge")
            line.setAttribute("x1", src.x)
            line.setAttribute("y1", src.y)
            line.setAttribute("x2", dst.x)
            line.setAttribute("y2", dst.y)
            line.setAttribute("stroke", edge.color)
            line.setAttribute("id", edge.id)
            edges.push(line)
        }

    })

    // Create the nodes
    window.graph.nodes.forEach(node => {
        // Create the circle for the node
        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("class", "node")
        circle.setAttribute("cx", node.x)
        circle.setAttribute("cy", node.y)
        circle.setAttribute("r", node.r)
        circle.setAttribute("id", node.id)
        nodes.push(circle)

        // Create the label for the node
        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("class", "node_label")
        text.setAttribute("x", node.x)
        text.setAttribute("y", node.y)
        text.setAttribute("id", "label-"+node.id)
        text.textContent = node.label
        nodesLabels.push(text)
    })

    // Append the nodes and edges to the SVG (in this order to make sure the edges are behind the nodes)
    edges.forEach(edge => svg.appendChild(edge))
    nodes.forEach(node => svg.appendChild(node))
    nodesLabels.forEach(label => svg.appendChild(label))
    edgesLabels.forEach(label => svg.appendChild(label))

    return svg.outerHTML    
}


/**
 * Generate a CSS representation of the graph
 * 
 * The CSS is generated from the graph global object and the nodes and edges are styled according to the global object
 * 
 * A specific style is generated for each node and edge to ensure that the custom styles are applied to the SVG elements
 */
export function generateCSS(){

    // Styles array
    const styles = [
        // Default styles
        "svg{font-size: 16px; font-family: Arial, sans-serif;}",  
    ]

    // Add the styles for the edges
    window.graph.edges.forEach(edge => {
        // Style of the line
        const edge_styles = {
            stroke: edge.color,
            "stroke-width": edge.thickness,
        }
        // Style of the weight label
        const edge_label_styles = {
            fill: edge.weightColor,
            "font-size": edge.weightFontSize,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
        }
        // Style of the weight box
        const edge_box_styles = {
            fill: edge.weightBackgroundColor,
        }

        // Add the styles to the array
        styles.push(`.edge#${edge.id} {${Object.entries(edge_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.weight#weight-${edge.id} {${Object.entries(edge_label_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.weight_box#box-${edge.id} {${Object.entries(edge_box_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)

    })


    // Add the styles for the nodes
    window.graph.nodes.forEach(node => {
        // Style of the node
        const node_styles = {
            fill: node.backgroundColor,
            stroke: node.borderColor,
            "stroke-width": node.borderWidth,
            "stroke-color": node.borderColor,
        }
        // Style of the label
        const node_label_styles = {
            fill: node.labelColor,
            "font-size": node.fontSize,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            "font-weight": "bold",
        }

        // Add the styles to the array
        styles.push(`.node#${node.id} {${Object.entries(node_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.node_label#label-${node.id} {${Object.entries(node_label_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
    })

    return styles.join("\n")
}