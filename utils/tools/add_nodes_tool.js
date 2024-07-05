import { checkShortcut } from "../../canvas-component/utils/keyboard"
import { Node } from "../../elements/node"
import constants from "../constants"

export default {
    setup() {
        window.graph.resetStates()
        const aux = new Node(window.graph.x, window.graph.y, "...", constants.NODE_RADIUS)
        aux.opacity = 0.5
        window.graph.newNode = aux
    },
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
    mouseMoveCallback(e, coords) {
        if (window.graph.newNode) {
            let nodeX = coords.x
            let nodeY = coords.y
    
            if (checkShortcut("shift")) {
                const gridSize = window.graph.gridSize
                nodeX = Math.round(nodeX / gridSize) * gridSize
                nodeY = Math.round(nodeY / gridSize) * gridSize
            }
            
            window.graph.newNode.x = nodeX
            window.graph.newNode.y = nodeY
        }
    },
    clean() {
        window.graph.resetStates()
    }
}