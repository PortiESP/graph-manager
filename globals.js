import CONSTANTS from "./utils/constants"
import { activateTool } from "./utils/tools/tools_callbacks"

export function setupGraphGlobals() {
    window.graph = {}

    // Graph data
    window.graph.nodes = [] // All nodes
    window.graph.selected = [] // Selected nodes

    // Config
    window.graph.prevent_deselect = false // Prevent deselecting nodes (used after dragging nodes)
    window.graph.showWeights = true // Show weights on edges

    // Dragging (use the `dragging.js` utils to handle dragging)
    window.graph.dragging = null // Dragging flag (do not use this directly, use the utils instead)
    window.graph.dragging_prev = { x: 0, y: 0 } // Previous mouse position when dragging started (do not use this directly, use the utils instead)

    // Nodes
    window.graph.newNode = false // New node being created

    // Edges
    window.dragging_edge = null // Dragging an edge
    window.graph.edges = [] // All edges
    window.graph.newEdgeScr = null // Source node for when the used is creating a new edge

    // Memento
    window.graph.memento = [] // Memento stack
    window.graph.mementoRedo = [] // Redo stack

    // Tools
    activateTool(CONSTANTS.DEFAULT_TOOL) // Activate the default tool

}