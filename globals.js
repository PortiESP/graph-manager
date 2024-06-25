import { resetPan } from "./canvas-component/utils/pan"
import { resetZoom } from "./canvas-component/utils/zoom"
import { Edge } from "./elements/edge"
import { Node } from "./elements/node"
import constants from "./utils/constants"
import CONSTANTS from "./utils/constants"
import { closestHoverNode } from "./utils/find_elements"
import { deselectAll } from "./utils/selection"
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
        this.doubleClickTarget = null // The target of the double click event (set to the target of the mouse down event when a double click is detected, and reset to null on the next mouse up event)

        // Config
        this.prevent_deselect = false // Prevent deselecting nodes (used after dragging nodes)
        this.showWeights = true // Show weights on edges
        this.snapToGrid = true // Snap nodes to the grid

        // Snap
        this.snapReference = null // Reference point for snapping (used when dragging nodes while on snap mode)

        // Flags
        this.newNode = false // New node being created
        this.newEdgeScr = null // Source node for when the used is creating a new edge

        // History
        this.memento = [] // Memento stack
        this.mementoRedo = [] // Redo stack
    }

    getElements() {
        return this.nodes.concat(this.edges).concat(this.info)
    }

    resetAll() {
        deselectAll()  // Deselect all nodes
        this.newEdgeScr = null  // Reset the edge creation
        this.newNode = false    // Reset the node creation
        resetPan() // Reset the drag, go to the (0, 0) position
        resetZoom() // Reset the zoom level to 1
        this.showAll() // Show all elements
        this.nodes.forEach(n => n.bubble = null) // Remove all bubbles
    }


    // Set the hidden property of all elements to false
    showAll() {
        this.getElements().forEach(e => e.hidden = false)
    }


    /**
     * Adds a new node to the graph global variable.
     * 
     * @param {number} x - The x coordinate of the node.
     * @param {number} y - The y coordinate of the node.
     * @param {number} r - The radius of the node.
     * @param {string} label - The label of the node.
     */
    addNodeToGraph(x, y, r, label = null) {
        // Default radius
        if (r === undefined) r = constants.DEFAULT_NODE_RADIUS

        // Append the node to the list of nodes
        this.nodes.push(new Node(x, y, r, label))
    }

    /**
     * Adds a new edge to the graph global variable.
     * 
     * @param {Node} src - The source node of the edge.
     * @param {Node} dst - The destination node of the edge.
     * @param {number} weight - The weight of the edge.
     */
    addEdgeToGraph(src, dst, weight) {
        // Default weight
        if (!weight) weight = constants.DEFAULT_EDGE_WEIGHT

        // If the source and destination nodes are valid and different, add the edge to the list of edges
        if (src && dst && src !== dst) {
            this.edges.push(new Edge(src, dst, weight))
        }

        this.stopCreatingEdge()
    }

    /**
     * Starts the process of creating a new node.
     */
    startCreatingNode() {
        this.newNode = true
    }

    /**
     * Stops the process of creating a new node. This function will not instantiate a new node nor add it to the graph.
     */
    stopCreatingNode() {
        this.newNode = false
    }

    /**
     * Returns whether the user is creating a new node.
     *  
     * @returns {boolean} Whether the user was hovering a node to start creating a new edge. If true, the user is creating a new edge. If false, the user is not creating a new edge.
     */
    startCreatingEdge() {
        this.newEdgeScr = closestHoverNode()
        return this.newEdgeScr
    }

    /**
     * Stops the process of creating a new edge. This function will not instantiate a new edge nor add it to the graph.
     */
    stopCreatingEdge() {
        this.newEdgeScr = null
    }

    /**
     * Returns whether the user is creating a new edge.
     *  
     * @returns {boolean} Whether the user is creating a new edge. If true, the user is creating a new edge. If false, the user is not creating a new edge.
     */
    isCreatingEdge() {
        return this.newEdgeScr !== null
    }


    findEdgeByNodes(srcId, dstId) {
        // If the source and destination nodes are a Node object, get their id
        if (srcId instanceof Node) srcId = srcId.id
        if (dstId instanceof Node) dstId = dstId.id

        // Get the edge with the given source and destination nodes
        return this.edges.find(e => {
            if (e.directed) return e.src.id === srcId && e.dst.id === dstId
            else return (e.src.id === srcId && e.dst.id === dstId) || (e.src.id === dstId && e.dst.id === srcId)
        })
    }

    hideAllBut(elements){
        this.getElements().forEach(e => e.hidden = !elements.includes(e))
    }
}

