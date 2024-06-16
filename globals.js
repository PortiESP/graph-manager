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