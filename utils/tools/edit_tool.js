import constants from "../constants"
import { closestHoverNode } from "../find_elements"
import { recordMemento } from "../memento"
import { deselectAll } from "../selection"

export default {
    setup: function () {
        deselectAll()
    },
    mouseDownCallback: function (button, mouse) {
        // If the user is creating a new node, drop it on the canvas
        if (button === 0 && window.graph.newNode) {
            window.graph.addNodeToGraph(window.cvs.x, window.cvs.y)
            window.graph.stopCreatingNode()
            return
        }

        // Checks if the user is hovering a node so it can start creating a new edge
        if (button === 0 && window.graph.startCreatingEdge()) return

    },
    mouseUpCallback: function (button, mouse) {
        // If the user is not creating a new edge, return
        if (button === 0 && window.graph.isCreatingEdge()) {
            const src = window.graph.newEdgeScr
            const dst = closestHoverNode()  
            window.graph.addEdgeToGraph(src, dst)
            return
        }
    },
    keyDownCallback: function (keyCode, mouse) {
        // If the user presses the delete/supr key, delete the hovered elements
        if (keyCode === constants.DELETE_KEY) {
            recordMemento()  // Record the current state before deleting the elements

            // Delete the hovered edges, if any
            window.graph.edges.forEach(edge => {
                if (edge.isHover()) edge.delete()
            })
            // Delete the hovered nodes, if any
            window.graph.nodes.forEach(node => {
                if (node.isHover()) node.delete()
            })
        }

        // If the user presses the N key, start creating a new node
        if (keyCode === constants.NODE_CREATION_KEY) {
            window.graph.newNode = true
        }
    },
    clean() {
        window.graph.newEdgeScr = null
        window.graph.newNode = false
    }
}