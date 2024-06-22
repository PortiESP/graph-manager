import constants from "./constants"

/**
 * Handles the dragging of elements in the canvas while in select mode.
 * 
 * @param {Event} e The event that triggered the dragging
 * @param {Object} mouse The mouse object with the current mouse position
 */
export function handleSelectDragging(e, mouse) {
    // Set the prevent_deselect flag to true
    window.graph.prevent_deselect = true

    // Get the offset
    let offset = {dx: e.movementX, dy: e.movementY}

    // If snap mode is enabled, snap the offset to the grid
    if (window.graph.snapToGrid) {
        offset = snapToGrid()
    }

    // Move the selected nodes
    window.graph.selected.forEach(e => e.moveBy(offset.dx, offset.dy))
}


/**
 * Handles the dragging of elements when the snap mode is enabled.
 * 
 * This function will return the offset to be applied to the dragged element to ensure it snaps to the grid.
 * 
 * @returns {Object} An object with the dx and dy offset to be applied to the dragged element (should be +/- the grid size)
 */
export function snapToGrid() {
    const gridSize = constants.GRID_SIZE
    const {x, y} = window.cvs

    let snapRef = window.graph.snapReference

    // If there is no snap reference, set it to the origin
    if (!snapRef) {
        snapRef = {x, y}
        window.graph.snapReference = snapRef
    }

    // Calculate the offset
    const dx = x - snapRef.x
    const dy = y - snapRef.y

    // Calculate the snapped offset
    const dxSnap = Math.round(dx / gridSize) * gridSize
    const dySnap = Math.round(dy / gridSize) * gridSize

    // Update the snap reference
    if (dxSnap) snapRef.x += dxSnap
    if (dySnap) snapRef.y += dySnap

    console.log(dxSnap, dySnap)

    // Return the snapped offset
    return {dx: dxSnap, dy: dySnap}
}