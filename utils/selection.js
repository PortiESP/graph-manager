import { stopDragging } from "./dragging"
import { closestHoverElement, closestHoverNode } from "./find_elements"

export function handlePrimaryBtnDown(button, mouse) {

    // Find the element under the mouse
    const e = closestHoverElement()

    // Shift key is pressed
    const isShift = window.cvs.key === 'ShiftLeft' || window.cvs.key === 'ShiftRight'

    // If shift is pressed, prevent deselect other nodes
    if (isShift) {
        // If clicked on an element, toggle its selection
        if (e) e.toggleSelect()
    } 
    // If shift is not pressed, allow deselect other nodes
    else {
        if (window.graph.selected.length === 1) deselectAll()

        // If clicked on an element, select it
        if (e) e.select()
            // If clicked on an empty space, deselect all nodes
        else deselectAll()

    }
}


export function handlePrimaryBtnUp(button, mouse) {

    // Stop dragging
    stopDragging()

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


export function deselectAll() {
    window.graph.selected.forEach(e => e.deselect())
    window.graph.selected = []
}