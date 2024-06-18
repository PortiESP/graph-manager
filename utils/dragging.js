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
    const offset = {dx: e.movementX, dy: e.movementY}

    // Move the selected nodes
    window.graph.selected.forEach(e => e.moveBy(offset.dx, offset.dy))
}
