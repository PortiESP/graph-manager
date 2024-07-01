import { getBoundingBoxOfAllNodes } from "../../view"

/**
 * Generate a graph array from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {Node: [Edge, ...], ...}
 */
export function generateGraphArray(){
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


export function generateEdgeAndNodesList(){
    const eList = generateEdgeList()
    const nList = window.graph.nodes.map(n => n.toString()).filter(n => !eList.join("").includes(n))
    return eList.concat(nList)
}


export function generateURL(){
    const url = new URL(window.location.href)
    const graph = generateEdgeAndNodesList().join("_")
    url.searchParams.set("graph", graph)

    return url.href
}

// Generate a SVG from the data in the graph global object, including the nodes and edges and their labels
// Also includes the weights of the edges
// Also use the colors of the nodes and edges
// The SVG is generated in the #export-svg element
export function generateSVG(elementId){
    const svg = document.getElementById(elementId)
    const svgNS = "http://www.w3.org/2000/svg"
    const xmlns = "http://www.w3.org/2000/xmlns/"
    const xlinkns = "http://www.w3.org/1999/xlink"

    // Clear the SVG
    while(svg.firstChild) svg.removeChild(svg.firstChild)

    // Set the SVG attributes
    svg.setAttribute("xmlns", svgNS)
    svg.setAttribute("xmlns:xlink", xlinkns)
    svg.setAttribute("version", "1.1")
    const {x1, y1, width, height} = getBoundingBoxOfAllNodes()
    svg.setAttribute("viewBox", `${x1} ${y1} ${width} ${height}`)

    // Create the defs element
    const defs = document.createElementNS(svgNS, "defs")
    svg.appendChild(defs)

    // Create the style element
    const style = document.createElementNS(svgNS, "style")
    style.textContent = `
        .node {
            fill: #fff;
            stroke: #000;
            stroke-width: 2px;
        }
        .edge {
            stroke: #000;
            stroke-width: 2px;
        }
        .label {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
    `
    defs.appendChild(style)

    // Create the nodes
    window.graph.nodes.forEach(node => {
        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("class", "node")
        circle.setAttribute("cx", node.x)
        circle.setAttribute("cy", node.y)
        circle.setAttribute("r", node.r)
        circle.setAttribute("fill", node.color)
        svg.appendChild(circle)

        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("class", "label")
        text.setAttribute("x", node.x)
        text.setAttribute("y", node.y)
        text.textContent = node.label
        svg.appendChild(text)
    })

    // Create the edges
    window.graph.edges.forEach(edge => {
        const line = document.createElementNS(svgNS, "line")
        line.setAttribute("class", "edge")
        line.setAttribute("x1", edge.src.x)
        line.setAttribute("y1", edge.src.y)
        line.setAttribute("x2", edge.dst.x)
        line.setAttribute("y2", edge.dst.y)
        line.setAttribute("stroke", edge.color)
        svg.appendChild(line)

        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("class", "label")
        text.setAttribute("x", (edge.src.x + edge.dst.x) / 2)
        text.setAttribute("y", (edge.src.y + edge.dst.y) / 2)
        text.textContent = edge.weight
        svg.appendChild(text)
    })
}