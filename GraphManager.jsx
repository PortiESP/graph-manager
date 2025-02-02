import { setupCanvas, mainLoop, unmountCanvas } from './canvas-component/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from './canvas-component/Canvas'
import { getActiveToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { focusOnAllNodes } from './utils/view'
import { loadFromEdgePlainTextList, loadFromJSON, loadFromURL } from './utils/load_graph'
import constants from './utils/constants'
import { circularArrange, organicArrange, toposortArrange, treeArrangeFromPrevsList } from './utils/arrangements'
import { generateAdjacencyList } from './utils/algorithms/algorithm_utils/generate_graph'
import { toposortKahn } from './utils/algorithms/toposort'
import bfs from './utils/algorithms/bfs'
import { closestHoverElement } from './utils/find_elements'
import { generateEdgesByPredecessors } from './utils/algorithms/algorithm_utils/convertions'
import { loadFromCache, saveToCache } from './utils/cache'
import kruskal from './utils/algorithms/kruskal'
import hamiltonianCycle from './utils/algorithms/hamiltonian-cycle'
import colorBorders from './utils/algorithms/color-borders'
import { getPressedShortcut } from './canvas-component/utils/keyboard'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import setupGraph from './utils/setup'
import { pertCtm } from './utils/algorithms/pert-ctm'

const isDev = import.meta.env.DEV

/**
 * Graph component
 * 
 * This component is responsible for setting up the graph tool.
 */
export default function Graph(props) {

    const navigator = useNavigate()  // Hook to navigate between routes

    useLayoutEffect(() => {
        // ---------------- Setup the canvas ----------------
        setupCanvas()

        // --- Setup the graph globals--- 
        setupGraph()

        // --- Config ---
        window.cvs.autoResize = true

        // --- Initial graph ---
        loadInitialGraph(navigator)

        // --- Setup automatic tool callbacks ---
        // Mouse down and up callbacks
        window.cvs.mouseDownCallback = getActiveToolCallback('mouseDownCallback')
        window.cvs.mouseUpCallback = getActiveToolCallback('mouseUpCallback')
        window.cvs.mouseMoveCallback = getActiveToolCallback('mouseMoveCallback')
        window.cvs.mouseDoubleClickCallback = getActiveToolCallback('mouseDoubleClickCallback')
        window.cvs.keyDownCallback = getActiveToolCallback('keyDownCallback')
        window.cvs.keyUpCallback = getActiveToolCallback('keyUpCallback')
        window.cvs.mouseScrollCallback = getActiveToolCallback('mouseScrollCallback')
        window.cvs.resizeCallback = getActiveToolCallback('resizeCallback')
        window.cvs.focusCallback = getActiveToolCallback('focusCallback')
        window.cvs.blurCallback = getActiveToolCallback('blurCallback')

        // --- Debug ---
        // Enable debug mode
        window.cvs.debug = isDev // Enable debug mode only in development mode
        const urlDebug = new URL(window.location.href).searchParams.get("debug")
        if (urlDebug) window.cvs.debug = urlDebug === "true"
        
        // Debug data and commands
        if (window.cvs.debug) {
            // Add debug data (information that will be displayed in the debug panel)
            window.cvs.debugData = () => ([
                "----------- Data -----------",
                "Nodes: " + window.graph.nodes.length,
                "Edges: " + window.graph.edges.length,
                "Selected: " + window.graph.selected.length,
                "History stack: " + window.graph.memento.length,
                "Redo stack: " + window.graph.mementoRedo.length,
                "Active tool: " + window.graph.tool || "None",
                "Snapping: " + `${window.graph.snapReference?.x}, ${window.graph.snapReference?.y}`,
                "Hover: " + closestHoverElement() || "None",
                "Shortcut: " + getPressedShortcut(),  
                `Dragging: ${window.graph.isDraggingElements === true ? "Yes" : window.graph.isDraggingElements === undefined ? "Preparing" : "No"}`,
                "----------- Edit -----------",
                "New node: " + window.graph.newNode,
                "New edge: " + !!window.graph.newEdge,
                "----------- Config -----------",
                "Snap to grid: " + window.graph.snapToGrid,
            ])
            // Add debug commands (commands that can be executed from the debug panel)
            window.cvs.debugCommands = window.cvs.debugCommands.concat([
                {
                    label: "Noti",
                    callback: () => {
                        console.log("Noti")
                        toast.error("test")
                    }
                },
                {
                    label: "PERT/CTM",
                    callback: () => {
                        const g = generateAdjacencyList()
                        console.log(pertCtm(g))
                    }
                },
                {
                    label: 'Generate graph array',
                    callback: () => {
                        const g = generateAdjacencyList()
                        console.log(g)
                        console.log(toposortKahn(g))
                    }
                },
                {
                    label: 'Load test graph',
                    callback: () => {
                        loadFromEdgePlainTextList(constants.TEMPLATE_GRAPH_2)
                        circularArrange(window.graph.nodes)
                        focusOnAllNodes()
                    }
                },
                {
                    label: 'Load test graph for toposort',
                    callback: () => {
                        loadFromEdgePlainTextList(constants.TEMPLATE_GRAPH_TOPO)
                        circularArrange(window.graph.nodes)
                        focusOnAllNodes()
                    }
                },
                {
                    label: "Toposort arrange",
                    callback: () => {
                        const g = generateAdjacencyList()
                        toposortArrange(g)
                        focusOnAllNodes()
                    }
                },
                {
                    label: 'Tree BFS arrange',
                    callback: () => {
                        const g = generateAdjacencyList()
                        const data = bfs(g, window.graph.nodes[0])
                        treeArrangeFromPrevsList(window.graph.nodes, data.prevNode, window.graph.nodes[0])
                        const edges = generateEdgesByPredecessors(data.prevNode)
                        const elements = edges.concat(window.graph.nodes)
                        window.graph.hideAllBut(elements)
                        data.result.forEach((node, i) => {
                            node.bubble = i
                        })
                        focusOnAllNodes()
                    }
                },
                {
                    label: 'Organic arrange',
                    callback: () => {
                        organicArrange()
                        focusOnAllNodes()
                    }
    
                },
                {
                    label: "Kruskal",
                    callback: () => {
                        const g = generateAdjacencyList()
                        const data = kruskal(g)
                        console.log(data)
                    }
                },
                {
                    label: "Hamiltonian cycle",
                    callback: () => {
                        const g = generateAdjacencyList()
                        const data = hamiltonianCycle(g, window.graph.nodes[0], true)
                        console.log(data)
                    }
                },
                {
                    label: "Color borders",
                    callback: () => {
                        const g = generateAdjacencyList()
                        console.log(colorBorders(g))
                        focusOnAllNodes()
                    }
                }
            ])
        }

        // ---------------- Main loop ----------------
        // Start the main loop (then, the next calls will be made by the loop itself)
        mainLoop(() => { // Main loop callback (repeats every frame)
            // Draw all elements
            drawAll()

            // There is nothing to update here since the events handle this for us (unless we want to update the graph in real-time or make some animations, etc.)
        })

        // --- Unmount ---
        return () => {
            unmountCanvas()
        }
    }, [])

    return <Canvas />
}


/**
 * Load the initial graph
 * 
 * This function is responsible for loading the initial graph between the following options:
 * - Load from URL
 * - Load example graph
 * - Load from cache
 * - Load default graph
 * 
 * @param {Function} nav - Function to navigate between routes
 */
function loadInitialGraph(nav){
        // --- LOAD FROM URL ---
        // Load the graph from the URL, if any
        const url = new URL(window.location.href)
        const sharedGraph = url.searchParams.get("graph")
        if (sharedGraph) {
            loadFromURL(window.location.href)
            circularArrange(window.graph.nodes)
            saveToCache()
            nav("/")
        }
        // Load example graph, if any
        const exampleGraph = url.searchParams.get("example")
        if (!sharedGraph && exampleGraph) {
            fetch(`/examples/${exampleGraph}.json`)
                .then(response => response.json())
                .then(data => {
                    loadFromJSON(data)
                    focusOnAllNodes()
                    saveToCache()
                    nav("/")
                })
        }

        // --- LOAD FROM CACHE ---
        let cacheLoaded = false
        if (!sharedGraph && !exampleGraph) {
            cacheLoaded = loadFromCache()
        }
        
        // --- LOAD DEFAULT GRAPH ---
        // Load the default graph if any of the above conditions are false
        if (!sharedGraph && !exampleGraph && !cacheLoaded) {
            loadFromJSON(constants.TEMPLATE_GRAPH)

            // Debug
            // loadFromEdgeArray(constants.TEMPLATE_GRAPH_3)
            // circularArrange(window.graph.nodes)
            
            // Focus after loading
        }


        // --- FOCUS ---
        focusOnAllNodes()
}