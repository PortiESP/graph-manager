import constants from "../../constants"
import { getBoundingBoxOfAllNodes } from "../../view"

/**
 * Generate a graph array from the graph global object
 * 
 * @returns {Object} An object with the nodes as keys and an array of edges as values: {Node: [Edge, ...], ...}
 */
export function generateGraphArray(){
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
    const xlinkns = "http://www.w3.org/1999/xlink"

    // Clear the SVG
    while(svg.firstChild) svg.removeChild(svg.firstChild)

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
        
        const text = document.createElementNS(svgNS, "text")
        text.setAttribute("class", "label")
        text.setAttribute("x", (src.x + dst.x) / 2)
        text.setAttribute("y", (src.y + dst.y) / 2)
        text.setAttribute("id", "label-"+edge.id)
        text.textContent = edge.weight
        edgesLabels.push(text)
        
        const textBox = document.createElementNS(svgNS, "rect")
        textBox.setAttribute("class", "label")
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

        // if (this.directed) {
        //     const rDst = this.dst.r
        //     const arrowSize = this.thickness * this.arrowSizeFactor
        //     const {src: offsetSrc, dst: offsetDst, angle} = this.nodesIntersectionBorderCoords(0, this.directed ? arrowSize*0.8 : 0) // Calculate the coordinates of the edge from border to border of the nodes instead of the center
    
        //     // Draw the edge
        //     window.ctx.beginPath()
        //     window.ctx.strokeStyle = this.color
        //     window.ctx.lineWidth = this.thickness
        //     window.ctx.moveTo(this.src.x, this.src.y)  // Move to the source node
        //     window.ctx.lineTo(offsetDst.x, offsetDst.y)  // Draw a line to the destination node
        //     window.ctx.stroke()

        //     const arrowAngle = Math.PI / 6
        //     const offsetDstArrow = { x: rDst * Math.cos(angle + Math.PI), y: rDst * Math.sin(angle + Math.PI) } // Calculate the coordinates of the arrow from the border of the node

        //     // Draw the arrow
        //     window.ctx.beginPath()
        //     window.ctx.fillStyle = this.color
        //     window.ctx.moveTo(this.dst.x + offsetDstArrow.x, this.dst.y + offsetDstArrow.y)
        //     window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle - arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle - arrowAngle))
        //     window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle + arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle + arrowAngle))
        //     window.ctx.fill()
        // } else {
        //     // Draw the edge
        //     window.ctx.beginPath()
        //     window.ctx.strokeStyle = this.color
        //     window.ctx.lineWidth = this.thickness
        //     window.ctx.moveTo(this.src.x, this.src.y)  
        //     window.ctx.lineTo(this.dst.x, this.dst.y)
        //     window.ctx.stroke()
        // }

        if (edge.directed){
            const arrowSize = edge.thickness * edge.arrowSizeFactor
            const {dst: dstDir, angle} = edge.nodesIntersectionBorderCoords(0, arrowSize*0.8)
            const rDst = edge.dst.r
            const offsetDstArrow = { x: rDst * Math.cos(angle + Math.PI), y: rDst * Math.sin(angle + Math.PI) } // Calculate the coordinates of the arrow from the border of the node
            const arrowAngle = Math.PI / 6

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

            const arrow = document.createElementNS(svgNS, "polygon")
            arrow.setAttribute("class", "edge")
            arrow.setAttribute("points", `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`)
            arrow.setAttribute("fill", edge.color)
            arrow.setAttribute("id", "edge-arrow-"+edge.id)
            edges.push(arrow)

        } else {
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
        const circle = document.createElementNS(svgNS, "circle")
        circle.setAttribute("class", "node")
        circle.setAttribute("cx", node.x)
        circle.setAttribute("cy", node.y)
        circle.setAttribute("r", node.r)
        circle.setAttribute("id", node.id)
        nodes.push(circle)

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
    
}


export function generateCSS(){

    const styles = [
        "svg{font-size: 16px; font-family: Arial, sans-serif;}",
    ]

    window.graph.edges.forEach(edge => {
        const edge_styles = {
            stroke: edge.color,
            "stroke-width": edge.thickness,
        }

        const edge_label_styles = {
            fill: edge.weightColor,
            "font-size": edge.weightFontSize,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
        }

        const edge_box_styles = {
            fill: edge.weightBackgroundColor,
        }

        styles.push(`.edge#${edge.id} {${Object.entries(edge_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.label#label-${edge.id} {${Object.entries(edge_label_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.label#box-${edge.id} {${Object.entries(edge_box_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)

    })

    window.graph.nodes.forEach(node => {
        const node_styles = {
            fill: node.backgroundColor,
            stroke: node.borderColor,
            "stroke-width": node.borderWidth,
            "stroke-color": node.borderColor,
        }

        const node_label_styles = {
            fill: node.labelColor,
            "font-size": node.fontSize,
            "text-anchor": "middle",
            "dominant-baseline": "middle",
            "font-weight": "bold",
        }

        styles.push(`.node#${node.id} {${Object.entries(node_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
        styles.push(`.node_label#label-${node.id} {${Object.entries(node_label_styles).map(([key, value]) => `${key}: ${value}`).join("; ")}}`)
    })

    return styles.join("\n")
}