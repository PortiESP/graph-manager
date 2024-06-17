import { setupCanvas, mainLoop } from '../canvas/utils/setup'
import { useLayoutEffect } from 'react'
import Canvas from '../canvas/Canvas'
import { setupGraphGlobals } from './globals'
import { Node } from './elements/node'
import { activeToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { Edge } from './elements/edge'

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
            const debugNodes = [new Node(100, 100, 30 ,"A"), new Node(200, 200, 30, "B"), new Node(300, 300, 30, "C")]
            window.graph.nodes.push(...debugNodes)
            window.graph.edges.push(new Edge(debugNodes[0], debugNodes[1]))

        }, true)  // true = Enable debug

        // ---------------- Main loop ----------------
        mainLoop(() => {
            // Draw all elements
            drawAll()

            // There is nothing to update here since the events handle this for us (unless we want to update the graph in real-time or make some animations, etc.)

            // Draw debug info
            if (window.cvs.debug) window.cvs.drawDebugInfo([
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
                "Canvas drag offset: (" + window.cvs.canvasDragOffset.x + ") - (" + window.cvs.canvasDragOffset.y + ")",
                "Zoom: " + window.cvs.zoom,
            ])
        })
    }, [])

    return <Canvas />
}