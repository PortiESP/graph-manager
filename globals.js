import constants from "./utils/constants"
import CONSTANTS from "./utils/constants"
import { activateTool } from "./utils/tools/tools_callbacks"

/**
 * Sets up the global variables used by the graph. These variables are stored in the `window.graph` object.
 * 
 * This function should be called in the `setupCanvas` function in the `Canvas` component.
 * 
 * **Properties** 
 * 
 * ---
 * 
 * @property {Array} nodes - All nodes in the graph
 * @property {Array} selected - Selected nodes
 * @property {boolean} prevent_deselect - Prevent deselecting nodes (used after dragging nodes)
 * @property {boolean} showWeights - Show weights on edges
 * @property {boolean} newNode - New node being created
 * @property {Object} dragging_edge - Dragging an edge
 * @property {Array} edges - All edges
 * @property {Object} newEdgeScr - Source node for when the used is creating a new edge
 * @property {Array} memento - Memento stack
 * @property {Array} mementoRedo - Redo stack
 * @property {Object} canvasDragOffset - Canvas drag offset
 * @property {number} zoom - Zoom factor
 * @property {number} zoomLevel - Zoom level (index of the zoom factor in the zoom levels array at the constants file)
 */
export function setupGraphGlobals() {
    window.graph = {}

    // Graph data
    window.graph.nodes = [] // All nodes
    window.graph.selected = [] // Selected nodes

    // Config
    window.graph.prevent_deselect = false // Prevent deselecting nodes (used after dragging nodes)
    window.graph.showWeights = true // Show weights on edges

    // Nodes
    window.graph.newNode = false // New node being created

    // Edges
    window.dragging_edge = null // Dragging an edge
    window.graph.edges = [] // All edges
    window.graph.newEdgeScr = null // Source node for when the used is creating a new edge

    // Memento
    window.graph.memento = [] // Memento stack
    window.graph.mementoRedo = [] // Redo stack

    // Drag and offsets
    window.graph.canvasDragOffset = { x: 0, y: 0 } // Coordinates of the canvas show at the top-left corner of the canvas

    // Zoom
    window.graph.zoom = 1 // Zoom factor
    window.graph.zoomLevel = constants.ZOOM_LEVELS.indexOf(1) // Zoom level (index of the zoom factor in the zoom levels array at the constants file)

    // Activate the default tool
    activateTool(CONSTANTS.DEFAULT_TOOL) // Activate the default tool

}