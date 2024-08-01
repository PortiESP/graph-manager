import { findElementsWithin } from "./find_elements"

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
    window.ui.call("setToolTip", "Drag to select multiple elements & release to confirm selection")
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

    // Update the tooltip
    window.ui.call("setToolTip", undefined)
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