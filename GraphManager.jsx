import { setupCanvas, mainLoop } from './canvas-component/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from './canvas-component/Canvas'
import { GraphGlobals } from './globals'
import { getActiveToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { focusOnAllNodes } from './utils/view'
import { loadFromEdgePlainTextList, loadFromJSON, loadFromURL } from './utils/load_graph'
import constants from './utils/constants'
import { circularArrange, organicArrange, toposortArrange, treeArrangeFromPrevsList } from './utils/arrangements'
import { generateEdgeArray } from './utils/algorithms/algorithm_utils/generate_graph'
import { toposortKahn } from './utils/algorithms/toposort'
import bfs from './utils/algorithms/bfs'
import { closestHoverElement } from './utils/find_elements'
import { getEdgesByPredecessors } from './utils/algorithms/algorithm_utils/convertions'
import { loadFromCache, saveToCache } from './utils/cache'

/**
 * Graph component
 * 
 * This component is responsible for setting up the graph tool.
 */
export default function Graph(props) {

    useLayoutEffect(() => {
        // ---------------- Setup the canvas ----------------
        setupCanvas()
        window.ctx.save()  // Save the initial state of the canvas after initializing it

        // --- Setup the graph globals--- 
        new GraphGlobals()

        // --- Config ---
        window.cvs.autoResize = true
        window.graph.enableCache = false

        // --- Initial graph ---
        loadInitialGraph()

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
        window.cvs.debug = true
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
            "----------- Edit -----------",
            "New node: " + window.graph.newNode,
            "New edge: " + !!window.graph.newEdge,
            "----------- Config -----------",
            "Snap to grid: " + window.graph.snapToGrid,
        ])

        window.cvs.debugCommands = window.cvs.debugCommands.concat([
            {
                label: 'Generate graph array',
                callback: () => {
                    const g = generateEdgeArray()
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
                    const g = generateEdgeArray()
                    toposortArrange(g)
                    focusOnAllNodes()
                }
            },
            {
                label: 'Tree BFS arrange',
                callback: () => {
                    const g = generateEdgeArray()
                    const data = bfs(g, window.graph.nodes[0])
                    treeArrangeFromPrevsList(window.graph.nodes, data.prevNode, window.graph.nodes[0])
                    const edges = getEdgesByPredecessors(data.prevNode)
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

            }
        ])

        // --- Setup the canvas ---
        document.getElementById("canvas").style.backgroundColor = window.graph.backgroundColor

        // Listeners
        window.graph.allListeners.push(saveToCache)

        // ---------------- Main loop ----------------
        mainLoop(() => {
            // Draw all elements
            drawAll()

            // There is nothing to update here since the events handle this for us (unless we want to update the graph in real-time or make some animations, etc.)
        })
    }, [])

    return <Canvas />
}



function loadInitialGraph(){
        // --- LOAD FROM URL ---
        // Load the graph from the URL, if any
        const url = new URL(window.location.href)
        const sharedGraph = url.searchParams.get("graph")
        if (sharedGraph) {
            loadFromURL(window.location.href)
            circularArrange(window.graph.nodes)
        }
        // Load example graph, if any
        const exampleGraph = url.searchParams.get("example")
        if (exampleGraph) {
            fetch(`/examples/${exampleGraph}.json`)
                .then(response => response.json())
                .then(data => {
                    loadFromJSON(data)
                    focusOnAllNodes()
                })
        }

        // --- LOAD FROM CACHE ---
        const cacheLoaded = loadFromCache()
        
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