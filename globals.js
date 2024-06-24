import CONSTANTS from "./utils/constants"
import { activateTool } from "./utils/tools/tools_callbacks"

/**
 * Setup the global variable `graph` that will store all the information about the graph.
 */
export function setupGraphGlobals() {
    window.graph = new Graph()

    // Activate the default tool
    activateTool(CONSTANTS.DEFAULT_TOOL) // Activate the default tool
}


/**
 * The Graph class that stores all the information about the graph.
 * 
 * @property {Array} nodes - All nodes in the graph
 * @property {Array} selected - Selected nodes
 * @property {Element} selectionBox - Object representing the selection box: {x1, y1, x2, y2}
 * @property {boolean} prevent_deselect - Prevent deselecting nodes (used after dragging nodes)
 * @property {boolean} showWeights - Show weights on edges
 * @property {boolean} snapToGrid - Snap elements to the grid
 * @property {Object} snapReference - Reference point for snapping (used when dragging nodes while on snap mode)
 * @property {boolean} newNode - New node being created
 * @property {Array} edges - All edges
 * @property {Object} newEdgeScr - Source node for when the used is creating a new edge
 * @property {Array} memento - Memento stack
 * @property {Array} mementoRedo - Redo stack
 * @property {Element} doubleClickTarget - The target of the double click event (set to the target of the mouse down event when a double click is detected, and reset to null on the next mouse up event)
 * @property {Array} info - Information elements
 */
export class Graph {
    constructor() {
        // Elements
        this.nodes = [] // All nodes
        this.edges = [] // All edges
        this.info = [] // Information elements

        // Selection
        this.selected = [] // Selected nodes
        this.selectionBox = null // Object representing the selection box: {x1, y1, x2, y2}
        // Double click
        this.doubleClickTarget = null, // The target of the double click event (set to the target of the mouse down event when a double click is detected, and reset to null on the next mouse up event)
        
        // Config
        this.prevent_deselect = false // Prevent deselecting nodes (used after dragging nodes)
        this.showWeights = true // Show weights on edges
        this.snapToGrid = true // Snap nodes to the grid
        
        // Snap
        this.snapReference = null, // Reference point for snapping (used when dragging nodes while on snap mode)

        // Flags
        this.newNode = false // New node being created
        this.newEdgeScr = null // Source node for when the used is creating a new edge

        // History
        this.memento = [] // Memento stack
        this.mementoRedo = [] // Redo stack
    }
}