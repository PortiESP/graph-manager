import { checkShortcut } from "../../canvas-component/utils/keyboard"
import { Edge } from "../../elements/edge"
import { closestHoverNode } from "../find_elements"

export default {
    // Ensures the graph doesn't have garbage in the states
    setup: function () {
        window.graph.resetStates()
    },
    // Creates an auxiliary edge to be used as a preview from the hovered node to an auxiliary node for the edge to use as a destination. The auxiliary node will later be replaced by the real real destination node.
    mouseDownCallback: function (button, mouse) {
        // Checks if the user is hovering a node so it can start creating a new edge
        if (button === 0) {
            const srcNode = closestHoverNode()
            if (!srcNode) return // If the user is not hovering a node, return

            // Create a fake node to be used as the destination of the edge
            const dstNode = { x: mouse.x, y: mouse.y, r: 0 } // Fake node (just to draw the edge)
            // Create an auxiliary edge from the hovered node to the fake node
            const newEdge = new Edge(srcNode, dstNode)

            // Save the auxiliary edge
            window.graph.newEdge = {
                src: srcNode,
                dst: dstNode, // Fake node (just to draw the edge)
                edge: newEdge
            }
        }
    },
    // If the user is creating a new edge, replace the fake node with the real destination node (hovered node) and add the edge to the graph
    mouseUpCallback: function (button, mouse) {
        // If the user is not creating a new edge, return
        if (button === 0) {
            // If the user is not creating a new edge, return
            if (!window.graph.isCreatingEdge()) return

            // Get the src node from the auxiliary edge
            const {src} = window.graph.newEdge
            // Get the destination node from the hovered node
            const dst = closestHoverNode()  
            // Get the directed property from the auxiliary edge (if the user was holding the shift key while creating the edge)
            const directed = window.graph.newEdge.edge.directed

            // If the destination node exists, add the edge to the graph
            if (dst) window.graph.addEdgeToGraph(src, dst, undefined, directed)

            // Remove the auxiliary edge
            window.graph.newEdge = null
            return
        }
    },
    // Updates the position of the fake node to the mouse position so the edge will follow the mouse
    mouseMoveCallback: function (e, coords) {
        // If the user is not creating a new edge, return
        if (!window.graph.isCreatingEdge()) return

        // Update the position of the fake node to the mouse position
        window.graph.newEdge.dst.x = coords.x
        window.graph.newEdge.dst.y = coords.y
    },
    // Listens to the shift key to change the directed property of the edge
    keyDownCallback: function (key) {
        // If the user pressed the shift key, enable the directed property of the edge
        if (checkShortcut("shift")){
            if (window.graph.isCreatingEdge()) window.graph.newEdge.edge.directed = true
        }
    },
    // Listens to the shift key to change the directed property of the edge
    keyUpCallback: function (key) {
        // If the user released the shift key, disable the directed property of the edge
        if (key === "ShiftLeft" || key === "ShiftRight"){
            if (window.graph.isCreatingEdge()) window.graph.newEdge.edge.directed = false
        }
    },
    // Ensures the graph doesn't leave garbage in the states
    clean() {
        window.graph.resetStates()
    }
}