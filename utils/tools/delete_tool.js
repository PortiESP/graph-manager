import { saveToCache } from "../cache"
import { closestHoverElement } from "../find_elements"
import { recordMemento } from "../memento"

export default {
    // Ensures the graph doesn't have garbage in the states
    setup: function () {
        window.graph.resetStates()
    },
    // Deletes the hovered node
    mouseDownCallback: function (button, mouse) {
        if (button === 0){
            // Checks if the user is hovering a node so it can start creating a new edge
            const element = closestHoverElement(mouse.x, mouse.y)

            // If the user is hovering a node, delete it
            if (element) {
                // Memento
                recordMemento()
                
                element.delete()

                // Cache
                saveToCache()
            }
        }
    },
    // Resets the graph states
    clean: function () {
        window.graph.resetStates()
    }
}