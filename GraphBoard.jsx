import { setupCanvas, mainLoop } from '../canvas/utils/setup'
import { useLayoutEffect, useState } from 'react'
import Canvas from '../canvas/Canvas'
import { setupGraphGlobals } from './globals'
import { Node } from './elements/node'
import { activeToolCallback } from './utils/tools/tools_callbacks'
import drawAll from './utils/draw'
import { Edge } from './elements/edge'

export default function Graph(props) {

    useLayoutEffect(() => {
        
        // ---------------- Setup the canvas ----------------
        setupCanvas(() => {
            // --- Setup the graph globals--- 
            setupGraphGlobals()

            // --- Setup callbacks ---
            // Mouse down and up callbacks
            window.cvs.mouseDownCallback = activeToolCallback('mouseDownCallback') 
            window.cvs.mouseUpCallback = activeToolCallback('mouseUpCallback')
            window.cvs.mouseMoveCallback = activeToolCallback('mouseMoveCallback')
            window.cvs.mouseDoubleClickCallback = activeToolCallback('mouseDoubleClickCallback')
            window.cvs.keyDownCallback = activeToolCallback('keyDownCallback')
            window.cvs.keyUpCallback = activeToolCallback('keyUpCallback')
            window.cvs.scrollCallback = activeToolCallback('scrollCallback')
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
            drawAll()

            // Draw debug info
            if (window.cvs.debug) window.cvs.drawDebugInfo([
                "Selected: " + window.graph.selected.length,
                "Dragging: " + !!window.graph.dragging,
                "Prevent deselect: " + window.graph.prevent_deselect,
                "Active tool: " + window.graph.tool || "None",
                "Nodes: " + window.graph.nodes.length,
                "New node: " + window.graph.newNode,
                "Edges: " + window.graph.edges.length,
                "New edge: " + !!window.graph.newEdgeScr,
                "Hover edge: " + window.graph.edges[0].isHover(),
                "History stack: " + window.graph.memento.length,
            ])
        })
    }, [])

    return <Canvas />
}