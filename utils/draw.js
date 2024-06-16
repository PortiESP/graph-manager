import constants from "./constants"

/**
 * Draw all the elements of the graph
 * - Grid
 * - Edges
 *      - Edges being created
 * - Nodes
 *     - Nodes being created
 */
export default function drawAll(){
    drawGrid()

    // --- Edges ---
    // Draw edges
    window.graph.edges.forEach(e => {
        e.draw()
    })

    // Draw new edge
    if (window.graph.newEdgeScr) {
        window.ctx.beginPath()
        window.ctx.moveTo(window.graph.newEdgeScr.x, window.graph.newEdgeScr.y)
        window.ctx.lineTo(window.cvs.x, window.cvs.y)
        window.ctx.stroke()
    }

    // --- Nodes ---
    // Draw nodes
    window.graph.nodes.forEach(e => {
        e.draw()
    })

    // Draw new node
    if (window.graph.newNode) {
        window.ctx.fillStyle = 'black'
        window.ctx.beginPath()
        window.ctx.arc(window.cvs.x, window.cvs.y, 30, 0, Math.PI * 2)
        window.ctx.fill()
    }
}

/**
 * Draw the grid
 */
export function drawGrid(){
    // Get the context and canvas
    const ctx = window.ctx
    const cvs = window.cvs

    // Grid properties
    const gridSize = constants.GRID_SIZE
    const gridColor = constants.GRID_COLOR
    const gridThickness = constants.GRID_THICKNESS

    // Draw the grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = gridThickness

    // Extract the canvas size
    const width = cvs.$canvas.width
    const height = cvs.$canvas.height

    // Get the offset
    const offsetX = window.graph.canvasDragOffset.x
    const offsetY = window.graph.canvasDragOffset.y

    // Calculate the initial and final positions of the grid
    const margin = 2*gridSize
    const iniXStep = Math.floor(offsetX / gridSize) * gridSize
    const iniYStep = Math.floor(offsetY / gridSize) * gridSize
    
    const iniX = -margin - iniXStep
    const iniY = -margin - iniYStep
    const finX = margin + width - iniXStep
    const finY = margin + height - iniYStep

    // Draw the grid vertical lines
    for (let x = iniX; x < finX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, iniY)
        ctx.lineTo(x, finY)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(x, x+10, -offsetY+10)
    }
    // Draw the grid horizontal lines
    for (let y = iniY; y < finY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(iniX, y)
        ctx.lineTo(finX, y)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(y, -offsetX+4, y+20)
    }
}