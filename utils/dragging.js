
/**
 * Handles the dragging of elements in the canvas while in select mode.
 * 
 * @param {Event} e The event that triggered the dragging
 * @param {Object} mouse The mouse object with the current mouse position
 */
export function handleSelectDragging(e, mouse) {

    // Get the offset
    let offset = {
        x: mouse.x - window.cvs.draggingOrigin.x, 
        y: mouse.y - window.cvs.draggingOrigin.y,
    }

    // If snap mode is enabled, snap the offset to the grid
    const elem = window.graph.selected.slice(-1)[0]
    if (window.graph.snapToGrid) {
        const gs = window.graph.gridSize
        const absOffsetX = Math.round(offset.x / gs) * gs
        const absOffsetY = Math.round(offset.y / gs) * gs
        const dx = elem._x % gs
        const dy = elem._y % gs
        offset.x = dx > gs / 2 ? absOffsetX + gs - dx : absOffsetX - dx
        offset.y = dy > gs / 2 ? absOffsetY + gs - dy : absOffsetY - dy
    }


    // Move the selected nodes
    window.graph.selected.forEach(e => e.offsetPos = offset)
}



export function startDragging(){
    window.graph.isDraggingElements = true
}

export function stopDragging(){
    // If the user is dragging elements
    if (window.graph.isDraggingElements) {
        // Reset the offset of the selected nodes
        window.graph.selected.forEach(e => (e.constructor.name === "Node") && e.applyOffset())
        window.graph.isDraggingElements = false
    }

}