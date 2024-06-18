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
 * @property {Array} edges - All edges
 * @property {Object} newEdgeScr - Source node for when the used is creating a new edge
 * @property {Array} memento - Memento stack
 * @property {Array} mementoRedo - Redo stack
 */
export function setupGraphGlobals() {
    window.graph = {}

    // Graph data
    window.graph.nodes = [] // All nodes
    window.graph.selected = [] // Selected nodes
    window.graph.selectionBox = null // Selection box

    // Config
    window.graph.prevent_deselect = false // Prevent deselecting nodes (used after dragging nodes)
    window.graph.showWeights = true // Show weights on edges

    // Nodes
    window.graph.newNode = false // New node being created

    // Edges
    window.graph.edges = [] // All edges
    window.graph.newEdgeScr = null // Source node for when the used is creating a new edge

    // Memento
    window.graph.memento = [] // Memento stack
    window.graph.mementoRedo = [] // Redo stack

    // Double click
    window.graph.doubleClickTarget = null, // The target of the double click event (set to the target of the mouse down event when a double click is detected, and reset to null on the next mouse up event)


    // Activate the default tool
    activateTool(CONSTANTS.DEFAULT_TOOL) // Activate the default tool

}