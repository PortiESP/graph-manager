import { checkShortcut } from "../../canvas-component/utils/keyboard"
import { Node } from "../../elements/node"

export default {
    // Resets the graph states, creates an auxiliary node to be used as a preview
    setup() {
        window.graph.resetStates()
        const aux = new Node(window.graph.x, window.graph.y, "...")
        aux.opacity = 0.5
        window.graph.newNode = aux
    },
    // Places the new node on the canvas
    mouseDownCallback(button, mouse) {
        // If the user is creating a new node, drop it on the canvas
        if (button === 0 && window.graph.newNode) {
            const x = window.graph.newNode.x
            const y = window.graph.newNode.y
            const r = window.graph.newNode.r
            const label = null
            window.graph.addNodeToGraph(x, y, r, label)
            return
        }
    },
    // Moves the auxiliary node to the mouse position
    mouseMoveCallback(e, coords) {
        // If the user is creating a new node, move it to the mouse position
        if (window.graph.newNode) {
            let nodeX = coords.x
            let nodeY = coords.y
    
            // Snap to grid if the user is holding the shift key
            if (checkShortcut("shift")) {
                const gridSize = window.graph.gridSize
                nodeX = Math.round(nodeX / gridSize) * gridSize
                nodeY = Math.round(nodeY / gridSize) * gridSize
            }
            
            // Update the node position
            window.graph.newNode.x = nodeX
            window.graph.newNode.y = nodeY
        }
    },
    // Removes the auxiliary node
    clean() {
        window.graph.resetStates()
    }
}