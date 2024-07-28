import { resetPan } from "./canvas-component/utils/pan"
import { resetZoom } from "./canvas-component/utils/zoom"
import { Edge } from "./elements/edge"
import { Node } from "./elements/node"
import { clearCache, saveToCache } from "./utils/cache"
import constants from "./utils/constants"
import CONSTANTS from "./utils/constants"
import drawAll from "./utils/draw"
import { recordMemento } from "./utils/memento"
import { deselectAll } from "./utils/selection"
import { setActivateTool } from "./utils/tools/tools_callbacks"

/**
 * The Graph class that stores all the information about the graph.
 * 
 * **Properties**:
 * 
 * ---
 * 
 * @property {Node[]} nodes - All nodes in the graph.
 * @property {Edge[]} edges - All edges in the graph.
 * @property {Node[]} selected - All selected nodes in the graph.
 * @property {Object} selectionBox - Object representing the selection box: {x1, y1, x2, y2}.
 * @property {boolean} showWeights - Show weights on edges.
 * @property {boolean} enableMemento - Enable memento.
 * @property {boolean} enableCache - Enable cache.
 * @property {string} tool - Active tool.
 * @property {Object} toolCallbacks - Active tool callbacks.
 * @property {boolean} gridEnabled - Show the grid.
 * @property {number} gridSize - Size of the grid.
 * @property {number} gridOpacity - Opacity of the grid.
 * @property {number} gridThickness - Thickness of the grid.
 * @property {string} gridColor - Color of the grid.
 * @property {boolean} snapToGrid - Snap nodes to the grid (used with shift key).
 * @property {Object} snapReference - Reference point for snapping (used when dragging nodes while on snap mode).
 * @property {boolean} newNode - New node being created.
 * @property {Object} newEdge - Auxiliar object for edge drawing {src:Node, dst:Object, edge:Edge}.
 * @property {boolean} isDraggingElements - Flag to check if the user is dragging elements.
 * @property {boolean} hasView - Flag to check if the graph has is showing a view (some elements may be hidden and others may be shown along with some additional information).
 * @property {string} backgroundColor - Background color.
 * @property {function} triggerAllListeners - Function to trigger all listeners.
 * @property {function} triggerSelectedListeners - Function to trigger selected listeners.
 * @property {function} triggerGraphListeners - Function to trigger graph listeners.
 * @property {function} triggerToolListeners - Function to trigger tool listeners.
 * @property {boolean} disableListeners - Flag to disable listeners.
 * @property {function[]} allListeners - General listener (any kind of change).
 * @property {function[]} selectedListeners - Selected nodes listener.
 * @property {function[]} graphListeners - Graph listener (nodes and edges).
 * @property {function[]} toolListeners - Tool listener.
 * 
 * **Methods**:
 * 
 * ---
 * 
 * @method reset - Resets the graph global variable to the default values.
 * @method pushSelected - Pushes elements to the selected nodes.
 * @method pushNode - Pushes nodes to the graph.
 * @method pushEdge - Pushes edges to the graph.
 * @method getElements - Gets all elements in the graph.
 * @method resetAll - Resets all elements in the graph.
 * @method resetStates - Resets the states of the graph.
 * @method showAll - Shows all elements in the graph.
 * @method addNodeToGraph - Adds a new node to the graph.
 * @method addEdgeToGraph - Adds a new edge to the graph.
 * @method isCreatingEdge - Returns whether the user is creating a new edge.
 * @method findEdgeByNodes - Finds an edge by its source and destination nodes.
 * @method hideAllBut - Hides all elements but the given elements.
 * @method rerender - Rerenders the graph.
 * 
 */
export class GraphGlobals {
    constructor() {
        // Set the global variable
        window.graph = this // This is required since some external functions rely on the window.graph variable

        // --- Properties ---
        this._nodes = [] // All nodes
        this._edges = [] // All edges

        // Selection
        this._selected = [] // Selected nodes
        this.selectionBox = null // Object representing the selection box: {x1, y1, x2, y2}

        // Config
        this.showWeights = constants.DEFAULT_SHOW_WEIGHTS // Show weights on edges
        this.enableMemento = constants.DEFAULT_ENABLE_MEMENTO // Enable memento
        this.enableCache = constants.DEFAULT_ENABLE_CACHE // Enable cache

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
        this.hasView = false // Flag to check if the graph has is showing a view (some elements may be hidden and others may be shown along with some additional information)

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
        this.disableListeners = false // Flag to disable listeners
        this.allListeners = []  // General listener (any kind of change)
        this.selectedListeners = []  // Selected nodes listener
        this.graphListeners = []  // Graph listener (nodes and edges)
        this.toolListeners = []  // Tool listener

        // Listeners triggers (These functions will trigger its respective listeners and the general listener)
        this.triggerAllListeners = () => {
            if (this.disableListeners) return
            
            this.allListeners.forEach(l => l(this))
        }
        this.triggerSelectedListeners = () => {
            if (this.disableListeners) return
            
            this.allListeners.forEach(l => l(this.selected))
            this.selectedListeners.forEach(l => l(this.selected))
        }
        this.triggerGraphListeners = () => {
            if (this.disableListeners) return
            
            this.allListeners.forEach(l => l(this.nodes))
            this.graphListeners.forEach(l => l(this.nodes))
        }
        this.triggerToolListeners = () => {
            if (this.disableListeners) return

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

        this.triggerGraphListeners()

        // Cache
        clearCache()
    }

    // --- Methods ---

    getElements() {
        return this.nodes.concat(this.edges)
    }

    resetAll() {
        deselectAll()  // Deselect all nodes
        this.resetStates() // Reset the states
        resetPan() // Reset the drag, go to the (0, 0) position
        resetZoom() // Reset the zoom level to 1
        this.showAll() // Show all elements
        this.nodes.forEach(n => n.bubble = null) // Remove all bubbles
        this.edges.forEach(e => e.hidden = false) // Show all edges
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
        // Memento
        recordMemento()
        
        // Default radius
        if (r === undefined) r = constants.NODE_RADIUS
        
        // Append the node to the list of nodes
        this.pushNode(new Node(x, y, label, r))

        // Cache
        saveToCache()
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
            // Memento
            recordMemento() 
            
            this.pushEdge(new Edge(src, dst, weight, directed))

            // Cache
            saveToCache()
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

    // --- Getters & Setters ---

    
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

}

