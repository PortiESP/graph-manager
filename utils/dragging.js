export function handleSelectDragging(e, mouse) {
    // Set the prevent_deselect flag to true
    window.graph.prevent_deselect = true

    // Calculate the offset
    const offset = {dx: e.movementX, dy: e.movementY}

    // Move the selected nodes
    window.graph.selected.forEach(e => e.moveBy(offset.dx, offset.dy))
}


export function resetDrag(){
    window.ctx.translate(-window.cvs.canvasDragOffset.x, -window.cvs.canvasDragOffset.y)
    window.cvs.canvasDragOffset = {x: 0, y: 0}
}

export function isDragging(){
    return (window.cvs.keysDown["Space"] && window.cvs.mouseDown === 0) || window.cvs.mouseDown === 1
}