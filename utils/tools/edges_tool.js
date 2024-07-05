import { checkShortcut } from "../../canvas-component/utils/keyboard"
import { Edge } from "../../elements/edge"
import { closestHoverNode } from "../find_elements"

export default {
    setup: function () {
        window.graph.resetStates()
        window.graph.newEdge = null
    },
    mouseDownCallback: function (button, mouse) {
        // Checks if the user is hovering a node so it can start creating a new edge
        if (button === 0) {
            const srcNode = closestHoverNode()
            if (!srcNode) return // If the user is not hovering a node, return

            const dstNode = { x: mouse.x, y: mouse.y, r: 0 } // Fake node (just to draw the edge)
            const newEdge = new Edge(srcNode, dstNode)


            window.graph.newEdge = {
                src: srcNode,
                dst: dstNode, // Fake node (just to draw the edge)
                edge: newEdge
            }
        }
    },
    mouseUpCallback: function (button, mouse) {
        // If the user is not creating a new edge, return
        if (button === 0 && window.graph.isCreatingEdge()) {
            const {src} = window.graph.newEdge
            const dst = closestHoverNode()  
            const directed = window.graph.newEdge.edge.directed

            if (dst) window.graph.addEdgeToGraph(src, dst, undefined, directed)

            // Reset the new edge
            window.graph.newEdge = null
            return
        }
    },
    mouseMoveCallback: function (e, coords) {
        // If the user is not creating a new edge, return
        if (!window.graph.isCreatingEdge()) return
        window.graph.newEdge.dst.x = coords.x
        window.graph.newEdge.dst.y = coords.y
    },
    keyDownCallback: function (key) {
        // If the user pressed the escape key, cancel the new edge creation
        if (checkShortcut("shift")){
            if (window.graph.isCreatingEdge()) window.graph.newEdge.edge.directed = true
        } 
    },
    keyUpCallback: function (key) {
        console.log(key)
        // If the user pressed the escape key, cancel the new edge creation
        if (key === "ShiftLeft" || key === "ShiftRight"){
            if (window.graph.isCreatingEdge()) window.graph.newEdge.edge.directed = false
        }
    },
    clean() {
        window.graph.resetStates()
    }
}