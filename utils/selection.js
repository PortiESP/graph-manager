import { checkShortcut } from "../canvas-component/utils/keyboard"
import { closestHoverElement, findElementsWithin } from "./find_elements"
import { discardLastSnapshot } from "./memento"


/**
 * Handles the primary mouse button down event.
 * 
 * @param {number} button - The button that was pressed.
 * @param {Object} mouse - The mouse event.
 */
export function handleSelectionPrimaryBtnDown(button, mouse) {
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
 * @param {number} button - The button that was pressed.
 * @param {Object} mouse - The mouse event.
 */
export function handleSelectionPrimaryBtnUp(button, mouse) {
    // Find the element under the mouse
    const e = closestHoverElement()

    if (e) {
        if (checkShortcut("shift")) return

        deselectAll()
        e.select()

    }
}


/**
 * Deselects all the selected elements.
 */
export function deselectAll() {
    window.graph.selected.forEach(e => e.deselect())
    window.graph.selected = [] 
}


/**
 * Configures the selection box to start.
 * 
 * This function will set the initial coordinates of the selection box.
 */
export function startSelectionBox(){
    window.graph.selectionBox = {
        x1: window.cvs.x,
        y1: window.cvs.y,
        x2: undefined,
        y2: undefined
    }
}


/**
 * Configures the selection box to end.
 * 
 * This function will select the elements inside the selection box and reset the selection box.
 */
export function endSelectionBox(){
    // Get the elements inside the selection box
    const { x1, y1, x2, y2 } = window.graph.selectionBox
    const elements = findElementsWithin(x1, y1, x2, y2)

    // Select the elements
    elements.forEach(e => e.select())

    // Reset the selection box
    window.graph.selectionBox = null
}


/**
 * Updates the selection box.
 * 
 * This function will update the selection box with the new coordinates to expand or shrink the current selection box.
 * 
 * @param {Object} coords - The new coordinates of the selection box.
 */
export function updateSelectionBox(coords){
    // Update the selection box
    window.graph.selectionBox.x2 = coords.x
    window.graph.selectionBox.y2 = coords.y
}