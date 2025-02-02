import { resetPan } from "./canvas-component/utils/pan"
import { resetZoom } from "./canvas-component/utils/zoom"
import { Edge } from "./elements/edge"
import { Node } from "./elements/node"
import { saveToCache } from "./utils/cache"
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
 * @property {boolean} isDraggingElements - Flag to check if the user is dragging elements. (null: not dragging, undefined: clicked but not moved, true: dragging).
 * @property {boolean} hasView - Flag to check if the graph has is showing a view (some elements may be hidden and others may be shown along with some additional information).
 * @property {string} backgroundColor - Background color.
 * @property {function} triggerAllListeners - Function to trigger all listeners.
 * @property {function} triggerSelectedListeners - Function to trigger selected listeners.
 * @property {function} triggerGraphListeners - Function to trigger graph listeners.
 * @property {function} triggerElementListeners - Function to trigger elements listeners.
 * @property {function} triggerToolListeners - Function to trigger tool listeners.
 * @property {boolean} disableListeners - Flag to disable listeners.
 * @property {function[]} allListeners - General listener (any kind of change).
 * @property {function[]} selectedListeners - Selected nodes listener.
 * @property {function[]} graphListeners - Graph listener (nodes and edges, just creation and removal).
 * @property {function[]} elementListeners - Elements listener (nodes and edges, any change).
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
 * @method resetGraphAndCanvasStates - Resets all elements in the graph.
 * @method resetGraphStates - Resets the states of the graph.
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

        // --- Properties ---
        this._nodes = [] // All nodes
        this._edges = [] // All edges

        // Selection
        this._selected = [] // Selected nodes
        this._selectionBox = null // Object representing the selection box: {x1, y1, x2, y2}

        // Config
        this._showWeights = constants.DEFAULT_SHOW_WEIGHTS // Show weights on edges
        this._enableMemento = constants.DEFAULT_ENABLE_MEMENTO // Enable memento
        this._enableCache = constants.DEFAULT_ENABLE_CACHE // Enable cache

        // Tools 
        this._tool = undefined // Active tool
        this._toolCallbacks = undefined // Active tool callbacks

        // Grid & Snap
        this._gridEnabled = constants.GRID_ENABLED // Show the grid
        this._gridSize = constants.GRID_SIZE // Size of the grid
        this._gridOpacity = constants.GRID_OPACITY // Opacity of the grid
        this._gridThickness = constants.GRID_THICKNESS // Thickness of the grid
        this._gridColor = constants.GRID_COLOR // Color of the grid
        this._snapToGrid = false // Snap nodes to the grid (used with shift key)
        this._snapReference = null // Reference point for snapping (used when dragging nodes while on snap mode)

        // Flags
        this._newNode = false // New node being created
        this._newEdge = null // Auxiliar object for edge drawing {src:Node, dst:Object, edge:Edge}
        this._isDraggingElements = false // Flag to check if the user is dragging elements (null: not dragging, undefined: clicked but not moved, true: dragging)
        this._hasView = false // Flag to check if the graph has is showing a view (some elements may be hidden and others may be shown along with some additional information)

        // History
        this._memento = [] // Memento stack
        this._mementoRedo = [] // Redo stack

        // Tools
        this.tool = undefined  // Active tool name
        this.toolCallbacks = undefined  // Object with the active tool callbacks

        // History
        this._memento = []  // Undo stack
        this._mementoRedo = []  // Redo stack

        // --- Listeners ---
        this._disableListeners = false // Flag to disable listeners
        this._allListeners = []  // General listener (any kind of change)
        this._selectedListeners = []  // Selected nodes listener
        this._graphListeners = []  // Graph listener (nodes and edges, just creation and removal)
        this._elementListeners = []  // Elements listener (nodes and edges, any change)
        this._toolListeners = []  // Tool listener

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

            this.allListeners.forEach(l => l(this.getElements()))
            this.graphListeners.forEach(l => l(this.getElements()))
        }
        this.triggerElementListeners = () => {
            if (this.disableListeners) return

            this.allListeners.forEach(l => l(this.getElements()))
            this.elementListeners.forEach(l => l(this.getElements()))
        }
        this.triggerToolListeners = () => {
            if (this.disableListeners) return

            this.allListeners.forEach(l => l(this.tool))
            this.toolListeners.forEach(l => l(this.tool))
        }
    }

    // ============================================================[ Methods ]============================================================>>>

    /**
     * Resets the graph global variable to the default values.
     */
    reset() {
        // Memento
        recordMemento()

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

        // History (not reseted)
        // this.memento = [] // Memento stack
        // this.mementoRedo = [] // Redo stack

        setActivateTool(CONSTANTS.DEFAULT_TOOL)

        this.triggerElementListeners()
    }

    /**
     * Resets all: States, views, config in the graph and canvas.
     * 
     * This function resets the graph and canvas states. It deselects all nodes, resets the states, resets the pan and zoom, shows all elements, removes all bubbles, and shows all edges.
     */
    resetGraphAndCanvasStates() {
        deselectAll()  // Deselect all nodes
        this.resetGraphStates() // Reset the states
        resetPan() // Reset the drag, go to the (0, 0) position
        resetZoom() // Reset the zoom level to 1
        this.resetView() // Reset the view
    }

    /**
     * Resets the states of the graph.
     * 
     * This function resets the states of the graph to the default values. It sets the newEdge to null, newNode to false, isDraggingElements to false, selectionBox to null, and snapReference to null.
     */
    resetGraphStates() {
        this.newEdge = null
        this.newNode = false
        this.isDraggingElements = false
        this.selectionBox = null
        this.snapReference = null
        this.snapToGrid = false
        deselectAll()
    }

    /**
     * Resets the view, showing all nodes and edges. And removes the additional information.
     */
    resetView() {
        this.showAll()
        this.nodes.forEach(node => node.bubble = null)
    }


    /**
     * Gets all elements in the graph (nodes and edges).
     * 
     * @returns {Array} All elements in the graph.
     */
    getElements() {
        return this.nodes.concat(this.edges)
    }


    /**
     * Shows all elements in the graph.
     * 
     * This function shows all elements in the graph by setting the hidden property of all elements to false.
     */
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
    addEdgeToGraph(src, dst, weight = constants.EDGE_WEIGHT, directed = false) {

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


    /**
     * Finds an edge by its source and destination nodes.
     * 
     * If the edge is directed, the source and destination nodes must match the edge's source and destination nodes.
     * 
     * @param {Node|String} srcId - The source node or the id of the source node.
     * @param {Node|String} dstId - The destination node or the id of the destination node.
     * @returns {Edge} The edge with the given source and destination nodes.
     */
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


    /**
     * Finds a node or edge by its id.
     * 
     * @param {String} id - The id of the element.
     * @returns {Element} The element with the given id.
     * @returns {null} If no element is found with the given id.
     */
    findElementById(id) {
        return this.getElements().find(e => e.id === id) || null
    }


    /**
     * Finds a node by its id.
     * 
     * @param {String} id - The id of the node.
     * @returns {Node} The node with the given id.
     * @returns {null} If no node is found with the given id.
     */
    findNodeById(id) {
        return this.nodes.find(e => e.id === id) || null
    }


    /**
     * Hides all elements but the given elements.
     * 
     * @param {Array} elements - The elements to keep visible (array of nodes and edges).
     */
    hideAllBut(elements) {
        this.getElements().forEach(e => e.hidden = !elements.includes(e))
    }


    /**
     * Checks if the graph is empty.
     * 
     * @returns {boolean} Whether the graph is empty. If true, the graph is empty. If false, the graph is not empty.
     */
    isGraphEmpty() {
        return this.nodes.length === 0
    }

    /**
     * Rerenders the graph. (DEBUG)
     * 
     * This function rerenders the graph by cleaning the canvas and drawing all elements
     * 
     * This function is used for debugging purposes, to force the canvas to print the current state of the graph at the moment of the call. 
     * 
     * ⚠️ This function is not recommended for normal use due to the canvas being rerendered in the middle of some calculations.
     */
    rerender() {
        window.cvs.clean()
        drawAll()
    }

    // --- Getters & Setters ---

    get nodes() { return this._nodes }
    set nodes(value) {
        this._nodes = value
        // Listeners
        this.triggerGraphListeners()
    }
    /**
     * Pushes nodes to the graph.
     * 
     * @param  {...Node} node - The node(s) to push to the graph.
     */
    pushNode(...node) {
        this.nodes = [...this.nodes, ...node]
    }

    get edges() { return this._edges }
    set edges(value) {
        this._edges = value
        // Listeners
        this.triggerGraphListeners()
    }
    /**
     * Pushes edges to the graph.
     * 
     * @param  {...Edge} edge - The edge(s) to push to the graph.
     */
    pushEdge(...edge) {
        this.edges = [...this.edges, ...edge]
    }

    get selected() { return this._selected }
    set selected(value) {
        this._selected.filter(e => !value.includes(e)).forEach(e => e.selected = false)  // Deselect nodes that are not in the new selected list
        this._selected = value
        // Listeners
        this.triggerSelectedListeners()
    }
    /**
     * Pushes elements to the selected nodes.
     * 
     * @param  {...Element} elements - The elements to push to the selected nodes.
     */
    pushSelected(...elements) {
        this.selected = [...this.selected, ...elements]
    }

    get selectionBox() { return this._selectionBox }
    set selectionBox(value) { this._selectionBox = value }

    get showWeights() { return this._showWeights }
    set showWeights(value) { this._showWeights = value }

    get enableMemento() { return this._enableMemento }
    set enableMemento(value) { this._enableMemento = value }

    get enableCache() { return this._enableCache }
    set enableCache(value) { this._enableCache = value }

    get tool() { return this._tool }
    set tool(value) { this._tool = value }

    get toolCallbacks() { return this._toolCallbacks }
    set toolCallbacks(value) { this._toolCallbacks = value }

    get gridEnabled() { return this._gridEnabled }
    set gridEnabled(value) { this._gridEnabled = value }

    get gridSize() { return this._gridSize }
    set gridSize(value) { this._gridSize = value }

    get gridOpacity() { return this._gridOpacity }
    set gridOpacity(value) { this._gridOpacity = value }

    get gridThickness() { return this._gridThickness }
    set gridThickness(value) { this._gridThickness = value }

    get gridColor() { return this._gridColor }
    set gridColor(value) { this._gridColor = value }

    get snapToGrid() { return this._snapToGrid }
    set snapToGrid(value) { this._snapToGrid = value }

    get snapReference() { return this._snapReference }
    set snapReference(value) { this._snapReference = value }

    get newNode() { return this._newNode }
    set newNode(value) { this._newNode = value }

    get newEdge() { return this._newEdge }
    set newEdge(value) { this._newEdge = value }

    get isDraggingElements() { return this._isDraggingElements }
    set isDraggingElements(value) { this._isDraggingElements = value }

    get hasView() { return this._hasView }
    set hasView(value) { this._hasView = value }

    get memento() { return this._memento }
    set memento(value) { this._memento = value }

    get mementoRedo() { return this._mementoRedo }
    set mementoRedo(value) { this._mementoRedo = value }

    get disableListeners() { return this._disableListeners }
    set disableListeners(value) { this._disableListeners = value }

    get allListeners() { return this._allListeners }
    set allListeners(value) { this._allListeners = value }

    get selectedListeners() { return this._selectedListeners }
    set selectedListeners(value) { this._selectedListeners = value }

    get graphListeners() { return this._graphListeners }
    set graphListeners(value) { this._graphListeners = value }

    get elementListeners() { return this._elementListeners }
    set elementListeners(value) { this._elementListeners = value }

    get toolListeners() { return this._toolListeners }
    set toolListeners(value) { this._toolListeners = value }
}

