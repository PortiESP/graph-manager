import { setupCanvas, mainLoop } from './canvas-component/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from './canvas-component/Canvas'
import { setupGraphGlobals } from './globals'
import { activeToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { focusOnAllNodes } from './utils/view'
import { getViewBox } from './canvas-component/utils/zoom'
import { loadFromEdgeArray, loadFromEdgePlainTextList, loadFromJSON } from './utils/load_graph'
import constants from './utils/constants'
import { circularArrange, toposortArrange, treeArrange, treeArrangeFromPrevsList } from './utils/arrangements'
import { generateGraphArray } from './utils/algorithms/algorithm_utils/generate_graph'
import { toposortKahn } from './utils/algorithms/toposort'
import bfs from './utils/algorithms/bfs'
import { Info } from './elements/Info'
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
        setupCanvas(() => {
            // --- Setup the graph globals--- 
            setupGraphGlobals()
            window.ctx.save()

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
            loadFromJSON(constants.TEMPLATE_GRAPH)
            
            // loadFromEdgeArray(constants.TEMPLATE_GRAPH_3)
            // circularArrange(window.graph.nodes)
            // focusOnAllNodes()

            focusOnAllNodes()

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
                "Prevent deselect: " + window.graph.prevent_deselect,
                "Snap to grid: " + window.graph.snapToGrid,
            ])

            window.cvs.debugCommands = window.cvs.debugCommands.concat([
                {
                    label: 'Toggle snap to grid',
                    callback: () => window.graph.snapToGrid = !window.graph.snapToGrid
                },
                {
                    label: 'Focus all',
                    callback: () => focusOnAllNodes()
                },
                {
                    label: 'Generate graph array',
                    callback: () => {
                        const g = generateGraphArray()
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
                        const g = generateGraphArray()
                        toposortArrange(g)
                        focusOnAllNodes()
                    }
                },
                {
                    label: 'Tree DFS arrange',
                    callback: () => {
                        const g = generateGraphArray()
                        treeArrange(g, window.graph.nodes[0])
                        focusOnAllNodes()
                    }
                },
                {
                    label: 'Tree BFS arrange',
                    callback: () => {
                        const g = generateGraphArray()
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
                    label: 'Tree DFS arrange (all)',
                    callback: () => {
                        const g = generateGraphArray()
                        const visited = {}
                        const conexComponents = []
                        for (const node of window.graph.nodes)
                            if (!visited[node]) conexComponents.push(bfs(g, node, visited))
                        const data = conexComponents.reduce((acc, val) => {
                            acc.result = acc.result.concat(val.result)
                            acc.prevNode = { ...acc.prevNode, ...val.prevNode }
                            return acc
                        }, { result: [], prevNode: {} })
                        treeArrangeFromPrevsList(window.graph.nodes, data.prevNode)
                        focusOnAllNodes()
                    }
                },
            ])

            document.getElementById("canvas").style.backgroundColor = window.graph.backgroundColor

        })

        // ---------------- Main loop ----------------
        mainLoop(() => {
            // Draw all elements
            drawAll()

            // There is nothing to update here since the events handle this for us (unless we want to update the graph in real-time or make some animations, etc.)
        })
    }, [])

    return <Canvas />
}