import { saveToCache } from "../cache"
import { closestHoverElement } from "../find_elements"
import { recordMemento } from "../memento"

export default {
    mouseDownCallback: function (button, mouse) {
        if (button === 0){
            // Checks if the user is hovering a node so it can start creating a new edge
            const element = closestHoverElement(mouse.x, mouse.y)

            if (element) {
                // Memento
                recordMemento()
                
                element.delete()

                // Cache
                saveToCache()
            }
        }
    },
}