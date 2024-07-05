import constants from "./constants"
import { getViewBox } from "../canvas-component/utils/zoom"

/**
 * Draw all the elements of the graph
 * - Grid
 * - Edges
 *      - Edges being created
 * - Nodes
 *     - Nodes being created
 */
export default function drawAll(){
    window.ctx.save() // Save the current context state

    // Reset styles
    window.ctx.font = `${12/cvs.zoom}px Arial`
    window.ctx.textAlign = 'left'
    
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
    if (window.graph.newNode) window.graph.newNode.draw()

    // --- Information ---
    // Draw information elements
    window.graph.info.forEach(e => {
        e.draw()
    })

    // --- Selection box ---
    drawSelectionBox()

    // --- Debug info ---
    if (window.cvs.debug) window.cvs.drawDebugInfo(window.cvs.debugData())

    window.ctx.restore() // Restore the context state
}

/**
 * Draw the grid
 */
export function drawGrid(){
    if (!window.graph.gridEnabled) return

    // Get the context and canvas
    const ctx = window.ctx
    const cvs = window.cvs

    ctx.save() // Save the current context state

    // Grid properties
    const gridSize = window.graph.gridSize
    const gridColor = window.graph.gridColor
    const gridThickness = window.graph.gridThickness

    // Draw the grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = gridThickness + 0.00000000000000001  // Hack to fix the canvas ignoring the thickness when the value is 0

    ctx.globalAlpha = window.graph.gridOpacity

    // Get the offset
    const coords = getViewBox()

    // Calculate the initial and final positions of the grid
    const gridOverflowMargin = 2*gridSize
    const iniXStep = Math.floor(coords.x / gridSize) * gridSize
    const iniYStep = Math.floor(coords.y / gridSize) * gridSize

    const iniX = -gridOverflowMargin + iniXStep
    const iniY = -gridOverflowMargin + iniYStep
    const finX = gridOverflowMargin + coords.x2
    const finY = gridOverflowMargin + coords.y2

    const labelMarginX = 4/cvs.zoom
    const labelMarginY = 12/cvs.zoom

    // Draw the grid vertical lines
    for (let x = iniX; x < finX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, iniY)
        ctx.lineTo(x, finY)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(x, x+labelMarginX, coords.y+labelMarginY)
    }
    // Draw the grid horizontal lines
    for (let y = iniY; y < finY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(iniX, y)
        ctx.lineTo(finX, y)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(y, coords.x+labelMarginX, y+labelMarginY)
    }

    ctx.restore() // Restore the context state
}


/**
 * Draw the selection box
 */
export function drawSelectionBox(){
    if (!window.graph.selectionBox) return

    const ctx = window.ctx
    ctx.save()

    const selectionBox = window.graph.selectionBox

    ctx.strokeStyle = constants.SELECTION_BOX_STROKE
    ctx.lineWidth = constants.SELECTION_BOX_THICKNESS
    ctx.fillStyle = constants.SELECTION_BOX_FILL
    ctx.fillRect(selectionBox.x1, selectionBox.y1, selectionBox.x2 - selectionBox.x1, selectionBox.y2 - selectionBox.y1)
    ctx.strokeRect(selectionBox.x1, selectionBox.y1, selectionBox.x2 - selectionBox.x1, selectionBox.y2 - selectionBox.y1)

    ctx.restore()
}


/**
 * Draw a mathematical function in the canvas
 * 
 * @param {Function} fx The function to draw
 * @param {String} color The color of the function
 */
export function drawFunction(fx, color){
    const ctx = window.ctx
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.moveTo(0, fx(0))
    ctx.lineTo(window.cvs.$canvas.width, fx(window.cvs.$canvas.width))
    ctx.stroke()

    ctx.restore()
}