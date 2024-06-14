import { Edge } from "../../elements/edge"
import { Node } from "../../elements/node"
import { startDragging, stopDragging } from "../dragging"
import { closestHoverNode, findEdgesByCoords, findNodesByCoords } from "../find_elements"
import { deselectAll } from "../selection"

export default {
    setup: function () {
        deselectAll()
    },
    mouseDownCallback: function (e) {
        // If the user is creating a new node, create it
        if (window.graph.newNode) {
            window.graph.nodes.push(new Node(window.cvs.x, window.cvs.y, 30))
            window.graph.newNode = false
            return
        }

        // If the user is not creating a new edge, check if they clicked on a node so they can start creating a new edge
        window.graph.newEdgeScr = closestHoverNode()
        if (window.graph.newEdgeScr) return

    },
    mouseUpCallback: function (e) {
        // If the user is not creating a new edge, return
        if (window.graph.newEdgeScr) {
            const src = window.graph.newEdgeScr
            const dst = closestHoverNode()
    
            if (src && dst && src !== dst) {
                window.graph.edges.push(new Edge(src, dst))
            }
    
            window.graph.newEdgeScr = null

            return
        }

        // If the user is dragging an edge point, stop dragging
        if (window.graph.dragging) {
            stopDragging()
            return
        }

    },
    keyDownCallback: function (keyCode, mouse) {
        if (keyCode === "Backspace") {
            window.graph.edges = window.graph.edges.filter(edge => !edge.isHover())
        }
        if (keyCode === "KeyN") {
            window.graph.newNode = true
        }
    },
}