import { checkShortcut } from "../../canvas/utils/keyboard"
import { closestHoverElement } from "./find_elements"
import { discardLastSnapshot } from "./memento"


/**
 * Handles the primary mouse button down event.
 * 
 * @param {number} button - The button that was pressed.
 * @param {Object} mouse - The mouse event.
 */
export function handlePrimaryBtnDown(button, mouse) {
    // Find the element under the mouse
    const e = closestHoverElement()

    // If shift is pressed, prevent deselect other nodes
    if (checkShortcut("shift")) {
        // If clicked on an element, toggle its selection
        if (e) e.toggleSelect()
    } 
    // If shift is not pressed, allow deselect other nodes
    else {
        // If clicked on an element, select it
        if (e) {
            if (!e.selected) {
                deselectAll()
                e.select()
            }
        }
        // If clicked on an empty space, deselect all nodes
        else {
            // Discard the last snapshot if nothing was selected (e.g.: when clicking on an empty space, the app will create a new snapshot, this call will discard it)
            if (window.graph.selected.length === 0)
                discardLastSnapshot()  

            // Deselect all nodes
            deselectAll()
        }

    }
}

/**
 * Handles the primary mouse button up event.
 * 
 * @param {number} button - The button that was released.
 * @param {Object} mouse - The mouse event.
 */
export function handlePrimaryBtnUp(button, mouse) {

    // Find the element under the mouse
    const e = closestHoverElement()

    // Prevent deselect all nodes if the flag is set (used after moving nodes)
    if (window.graph.prevent_deselect) {
        window.graph.prevent_deselect = false
        return
    }

    // If shift is not pressed, deselect all nodes
    const isShift = window.cvs.key === 'ShiftLeft' || window.cvs.key === 'ShiftRight'
    if (!isShift) deselectAll()

    // If clicked on an element, select it
    if (e) e.select()
}

/**
 * Deselects all the selected elements.
 */
export function deselectAll() {
    window.graph.selected.forEach(e => e.deselect())
    window.graph.selected = []  // Redundant, but just to make sure
}