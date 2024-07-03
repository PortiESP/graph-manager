import { setupCanvas, mainLoop } from './canvas-component/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from './canvas-component/Canvas'
import { setupGraphGlobals } from './globals'
import { activeToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { focusOnAllNodes } from './utils/view'
import { loadFromEdgePlainTextList, loadFromJSON, loadFromURL } from './utils/load_graph'
import constants from './utils/constants'
import { circularArrange, toposortArrange, treeArrange, treeArrangeFromPrevsList } from './utils/arrangements'
import { generateEdgeArray } from './utils/algorithms/algorithm_utils/generate_graph'
import { toposortKahn } from './utils/algorithms/toposort'
import bfs from './utils/algorithms/bfs'
import { closestHoverElement } from './utils/find_elements'
import { getEdgesByPredecessors } from './utils/algorithms/algorithm_utils/convertions'

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
        setupGraphGlobals()

        // --- Setup the graph ---
        // Check whether the URL has a graph to load or an example to load, otherwise load the default graph

        // Load the graph from the URL, if any
        const url = new URL(window.location.href)
        let initialGraph = url.searchParams.get("graph")
        if (initialGraph) {
            loadFromURL(window.location.href)
            circularArrange(window.graph.nodes)
            focusOnAllNodes()
        }
        // Load example graph, if any
        initialGraph = url.searchParams.get("example")
        if (initialGraph) {
            fetch(`/examples/${initialGraph}.json`)
                .then(response => response.json())
                .then(data => {
                    loadFromJSON(data)
                    focusOnAllNodes()
                })
        }
        // Load the default graph if any of the above conditions are false
        if (!initialGraph) {
            loadFromJSON(constants.TEMPLATE_GRAPH)

            // Debug
            // loadFromEdgeArray(constants.TEMPLATE_GRAPH_3)
            // circularArrange(window.graph.nodes)
            
            // Focus after loading
            focusOnAllNodes()
        }



        // --- Setup automatic tool callbacks ---
        // Mouse down and up callbacks
        window.cvs.mouseDownCallback = activeToolCallback('mouseDownCallback')
        window.cvs.mouseUpCallback = activeToolCallback('mouseUpCallback')
        window.cvs.mouseMoveCallback = activeToolCallback('mouseMoveCallback')
        window.cvs.mouseDoubleClickCallback = activeToolCallback('mouseDoubleClickCallback')
        window.cvs.keyDownCallback = activeToolCallback('keyDownCallback')
        window.cvs.keyUpCallback = activeToolCallback('keyUpCallback')
        window.cvs.mouseScrollCallback = activeToolCallback('mouseScrollCallback')
        window.cvs.resizeCallback = activeToolCallback('resizeCallback')

        // --- Config ---
        window.cvs.autoResize = true

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
            "New edge: " + !!window.graph.newEdgeScr,
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
        ])

        // --- Setup the canvas ---
        document.getElementById("canvas").style.backgroundColor = window.graph.backgroundColor

        // ---------------- Main loop ----------------
        mainLoop(() => {
            // Draw all elements
            drawAll()

            // There is nothing to update here since the events handle this for us (unless we want to update the graph in real-time or make some animations, etc.)
        })
    }, [])

    return <Canvas />
}