import { setupCanvas, mainLoop } from '../canvas/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from '../canvas/Canvas'
import { setupGraphGlobals } from './globals'
import { Node } from './elements/node'
import { activeToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { Edge } from './elements/edge'
import { focusOnAll, focusOnElement } from './utils/view'
import { getViewBox } from '../canvas/utils/zoom'
import { loadFromEdgePlainTextList, loadFromJSON } from './utils/load_graph'
import constants from './utils/constants'

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

            // --- Setup callbacks ---
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
                "Selected: " + window.graph.selected.length,
                "Prevent deselect: " + window.graph.prevent_deselect,
                "Active tool: " + window.graph.tool || "None",
                "Nodes: " + window.graph.nodes.length,
                "New node: " + window.graph.newNode,
                "Edges: " + window.graph.edges.length,
                "New edge: " + !!window.graph.newEdgeScr,
                "Hover edge: " + window.graph.edges.filter(e => e.isHover()).length,
                "History stack: " + window.graph.memento.length,
                "Redo stack: " + window.graph.mementoRedo.length,
                "Double click target: " + window.graph.doubleClickTarget,
                "Snap to grid: " + window.graph.snapToGrid,
                "Snapping: " + `${window.graph.snapReference?.x}, ${window.graph.snapReference?.y}`
            ])
            const debugNodes = [new Node(100, 100, 30 ,"A"), new Node(200, 200, 30, "B"), new Node(300, 300, 30, "C")]
            window.graph.nodes.push(...debugNodes)
            window.graph.edges.push(new Edge(debugNodes[0], debugNodes[1]))
            window.cvs.debugCommands = window.cvs.debugCommands.concat([
                {
                    label: 'Focus all',
                    callback: () => focusOnAll()
                },
                {
                    label: 'Load test graph',
                    callback: () => loadFromEdgePlainTextList(constants.TEMPLATE_GRAPH_2)
                },
                {
                    label: 'Toggle snap to grid',
                    callback: () => window.graph.snapToGrid = !window.graph.snapToGrid
                }
            ])

            // Redraw the graph
            window.graph.update = ()=> {
                    const coords = getViewBox()  // Get the coordinates of the view box
                    const margin = 10000  // Margin to clear the canvas and avoid artifacts
                    window.ctx.clearRect(coords.x - margin, coords.y - margin, coords.width + margin*2, coords.height + margin*2)
                    drawAll()
            }


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