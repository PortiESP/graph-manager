import constants from "./constants"
import { getViewBox } from "../../canvas/utils/zoom"

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

/**
 * Returns to the original position the canvas (0, 0) 
 */
export function resetDrag(){
    const {x, y} = getViewBox()
    window.ctx.translate(x, y)
    window.cvs.canvasDragOffset = {x: 0, y: 0}
}

/**
 * Returns true if the user has the dragging keys pressed.
 * 
 * The dragging action can be triggered by any of the following:
 * - Holding the pan key (Space+LeftMouseButton)
 * - Holding the pan mouse button (Middle mouse button)
 * 
 * @returns {boolean} Whether the user is dragging elements in the canvas.
 */
export function isDragging(){
    const option1 = window.cvs.keysDown[constants.PAN_KEY] && window.cvs.mouseDown === 0
    const option2 = window.cvs.mouseDown === constants.PAN_MOUSE_BUTTON
    return option1 || option2
}