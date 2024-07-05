import { closestHoverNode } from "../find_elements"

export default {
    setup: function () {
        window.graph.resetStates()
    },
    mouseDownCallback: function (button, mouse) {
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
    keyDownCallback: function (keyCode, mouse) {},
    clean() {
        window.graph.resetStates()
    }
}