import { resetPan } from "./canvas-component/utils/pan"
import { resetZoom } from "./canvas-component/utils/zoom"
import { Edge } from "./elements/edge"
import { Node } from "./elements/node"
import constants from "./utils/constants"
import CONSTANTS from "./utils/constants"
import drawAll from "./utils/draw"
import { closestHoverNode } from "./utils/find_elements"
import { deselectAll } from "./utils/selection"
import { setActivateTool } from "./utils/tools/tools_callbacks"

/**
 * The Graph class that stores all the information about the graph.
 * 
 * @property {Array} nodes - All nodes in the graph
 * @property {Array} selected - Selected nodes
 * @property {Element} selectionBox - Object representing the selection box: {x1, y1, x2, y2}
 * @property {boolean} showWeights - Show weights on edges
 * @property {boolean} snapToGrid - Snap elements to the grid
 * @property {Object} snapReference - Reference point for snapping (used when dragging nodes while on snap mode)
 * @property {boolean} newNode - New node being created
 * @property {Array} edges - All edges
 * @property {Object} newEdge - Auxiliar object for edge drawing
 * @property {Array} memento - Memento stack
 * @property {Array} mementoRedo - Redo stack
 * @property {Array} info - Information elements
 */
export class GraphGlobals {
    constructor() {
        // Set the global variable
        window.graph = this // This is required since some external functions rely on the window.graph variable

        // --- Properties ---
        this._nodes = [] // All nodes
        this._edges = [] // All edges
        this._info = [] // Information elements

        // Selection
        this._selected = [] // Selected nodes
        this.selectionBox = null // Object representing the selection box: {x1, y1, x2, y2}

        // Config
        this.showWeights = true // Show weights on edges
        this.enableMemento = true // Enable memento
        this.enableCache = true // Enable cache

        // Tools 
        this.tool = undefined // Active tool
        this.toolCallbacks = undefined // Active tool callbacks
                
        // Grid & Snap
        this.gridEnabled = constants.GRID_ENABLED // Show the grid
        this.gridSize = constants.GRID_SIZE // Size of the grid
        this.gridOpacity = constants.GRID_OPACITY // Opacity of the grid
        this.gridThickness = constants.GRID_THICKNESS // Thickness of the grid
        this.gridColor = constants.GRID_COLOR // Color of the grid
        this.snapToGrid = false // Snap nodes to the grid (used with shift key)
        this.snapReference = null // Reference point for snapping (used when dragging nodes while on snap mode)

        // Flags
        this.newNode = false // New node being created
        this.newEdge = null // Auxiliar object for edge drawing {src:Node, dst:Object, edge:Edge}
        this.isDraggingElements = false // Flag to check if the user is dragging elements

        // History
        this.memento = [] // Memento stack
        this.mementoRedo = [] // Redo stack

        // Style
        this.backgroundColor = constants.BACKGROUND_COLOR // Background color

        // Tools
        window.graph.tool = undefined
        window.graph.toolCallbacks = undefined

        // History
        this.memento = []
        this.mementoRedo = []

        // --- Listeners ---
        this.allListeners = []  // General listener (any kind of change)
        this.selectedListeners = []  // Selected nodes listener
        this.graphListeners = []  // Graph listener (nodes and edges)
        this.toolListeners = []  // Tool listener

        // Listeners triggers (These functions will trigger its respective listeners and the general listener)
        this.triggerAllListeners = () => this.allListeners.forEach(l => l(this))
        this.triggerSelectedListeners = () => {
            this.allListeners.forEach(l => l(this.selected))
            this.selectedListeners.forEach(l => l(this.selected))
        }
        this.triggerGraphListeners = () => {
            this.allListeners.forEach(l => l(this.nodes))
            this.graphListeners.forEach(l => l(this.nodes))
        }
        this.triggerToolListeners = () => {
            this.allListeners.forEach(l => l(this.tool))
            this.toolListeners.forEach(l => l(this.tool))
        }


        // --- Setup ---
        setActivateTool(CONSTANTS.DEFAULT_TOOL)
    }


    /**
     * Resets the graph global variable to the default values.
     */
    reset() {
        // Elements
        this.nodes = [] // All nodes
        this.edges = [] // All edges
        this.info = [] // Information elements

        // Selection
        this.selected = [] // Selected nodes
        this.selectionBox = null // Object representing the selection box: {x1, y1, x2, y2}

        // Config
        this.showWeights = true // Show weights on edges

        // Tools 
        this.tool = undefined // Active tool
        this.toolCallbacks = undefined // Active tool callbacks
        
        // Grid & Snap
        this.gridEnabled = constants.GRID_ENABLED // Show the grid
        this.gridSize = constants.GRID_SIZE // Size of the grid
        this.gridOpacity = constants.GRID_OPACITY // Opacity of the grid
        this.gridThickness = constants.GRID_THICKNESS // Thickness of the grid
        this.gridColor = constants.GRID_COLOR // Color of the grid
        this.snapToGrid = false // Snap nodes to the grid (used with shift key)
        this.snapReference = null // Reference point for snapping (used when dragging nodes while on snap mode)

        // Flags
        this.newNode = false // New node being created
        this.newEdge = null // Source node for when the used is creating a new edge
        this.isDraggingElements = false // Flag to check if the user is dragging elements

        // History
        this.memento = [] // Memento stack
        this.mementoRedo = [] // Redo stack

        // Style
        this.backgroundColor = constants.BACKGROUND_COLOR // Background color

        setActivateTool(CONSTANTS.DEFAULT_TOOL)

        this.memento = []
        this.mementoRedo = []
    }


    // Getters & Setters

    get selected() {
        return this._selected
    }

    set selected(value) {
        this._selected = value

        // Listeners
        this.triggerSelectedListeners()
    }

    pushSelected(...elements) {
        this.selected = [...this.selected, ...elements]
    }

    get nodes() {
        return this._nodes
    }

    set nodes(value) {
        this._nodes = value
        
        // Listeners
        this.triggerGraphListeners()
    }

    pushNode(...node) {
        this.nodes = [...this.nodes, ...node]
    }

    get edges() {
        return this._edges
    }

    set edges(value) {
        this._edges = value
        
        // Listeners
        this.triggerGraphListeners()
    }

    pushEdge(...edge) {
        this.edges = [...this.edges, ...edge]
    }

    get info() {
        return this._info
    }

    set info(value) {
        this._info = value

        // Listeners
        this.triggerGraphListeners()
    }

    // Methods

    getElements() {
        return this.nodes.concat(this.edges).concat(this.info)
    }

    resetAll() {
        deselectAll()  // Deselect all nodes
        this.resetStates() // Reset the states
        resetPan() // Reset the drag, go to the (0, 0) position
        resetZoom() // Reset the zoom level to 1
        this.showAll() // Show all elements
        this.nodes.forEach(n => n.bubble = null) // Remove all bubbles
    }

    resetStates() {
        this.newEdge = null
        this.newNode = false
        this.isDraggingElements = false
        this.selectionBox = null
        this.snapReference = null
        this.snapToGrid = false
        deselectAll()
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
        if (r === undefined) r = constants.NODE_RADIUS

        // Append the node to the list of nodes
        this.pushNode(new Node(x, y, label, r))
    }

    /**
     * Adds a new edge to the graph global variable.
     * 
     * @param {Node} src - The source node of the edge.
     * @param {Node} dst - The destination node of the edge.
     * @param {number} weight - The weight of the edge.
     */
    addEdgeToGraph(src, dst, weight=constants.EDGE_WEIGHT, directed=false) {

        // If the source and destination nodes are valid and different, add the edge to the list of edges
        if (src && dst && src !== dst) {
            this.pushEdge(new Edge(src, dst, weight, directed))
        }
    }

    /**
     * Returns whether the user is creating a new edge.
     *  
     * @returns {boolean} Whether the user is creating a new edge. If true, the user is creating a new edge. If false, the user is not creating a new edge.
     */
    isCreatingEdge() {
        return this.newEdge !== null
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

    // Debug
    rerender(){
        window.cvs.clean()
        drawAll()
    }
}

