import constants from "./constants"
import { getViewBox } from "../../canvas/utils/zoom"

/**
 * Draw all the elements of the graph
 * - Grid
 * - Edges
 *      - Edges being created
 * - Nodes
 *     - Nodes being created
 */
export default function drawAll(){
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
    if (window.graph.newNode) {
        window.ctx.fillStyle = 'black'
        window.ctx.beginPath()
        window.ctx.arc(window.cvs.x, window.cvs.y, 30, 0, Math.PI * 2)
        window.ctx.fill()
    }

    // --- Information ---
    // Draw information elements
    window.graph.info.forEach(e => {
        e.draw()
    })

    // --- Selection box ---
    drawSelectionBox()

    if (window.cvs.debug) window.cvs.drawDebugInfo(window.cvs.debugData())
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

    const labelMargin = 10/cvs.zoom

    // Draw the grid vertical lines
    for (let x = iniX; x < finX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, iniY)
        ctx.lineTo(x, finY)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(x, x+labelMargin, coords.y+labelMargin)
    }
    // Draw the grid horizontal lines
    for (let y = iniY; y < finY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(iniX, y)
        ctx.lineTo(finX, y)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(y, coords.x+labelMargin, y+labelMargin)
    }
}


export function drawSelectionBox(){
    if (!window.graph.selectionBox) return

    const ctx = window.ctx
    const selectionBox = window.graph.selectionBox

    ctx.strokeStyle = constants.SELECTION_BOX_STROKE
    ctx.lineWidth = constants.SELECTION_BOX_THICKNESS
    ctx.fillStyle = constants.SELECTION_BOX_FILL
    ctx.fillRect(selectionBox.x1, selectionBox.y1, selectionBox.x2 - selectionBox.x1, selectionBox.y2 - selectionBox.y1)
    ctx.strokeRect(selectionBox.x1, selectionBox.y1, selectionBox.x2 - selectionBox.x1, selectionBox.y2 - selectionBox.y1)
}