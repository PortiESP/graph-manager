import { closestHoverNode } from "./find_elements"

export function handleSelectDragging(e, mouse) {
    // Set the prevent_deselect flag to true
    window.graph.prevent_deselect = true
    console.log("dragging", window.graph.selected)

    // If the dragging flag is not set, set it
    if (!window.graph.dragging) startDragging(closestHoverNode())

    // Calculate the offset
    const offset = {dx: e.movementX, dy: e.movementY}

    // Move the selected nodes
    window.graph.selected.forEach(e => e.moveBy(offset.dx, offset.dy))
}


export function startDragging(element) {
    window.graph.dragging = element
    window.graph.dragging_prev = { x: window.cvs.x, y: window.cvs.y }
}

export function stopDragging() {
    window.graph.dragging = null
    window.graph.dragging_prev = { x: undefined, y: undefined }
}
