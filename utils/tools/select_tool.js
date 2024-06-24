import { handleSelectDragging } from "../dragging"
import { closestHoverElement } from "../find_elements"
import { recordMemento } from "../memento"
import { endSelectionBox, handleSelectionPrimaryBtnDown, handleSelectionPrimaryBtnUp, startSelectionBox, updateSelectionBox } from "../selection"

export default {
    mouseDownCallback: (btn, mouse) => {
        if (btn === 0) {
            recordMemento()
            handleSelectionPrimaryBtnDown(btn, mouse)

            // If the user clicked an empty space (selection box mode)
            const element = closestHoverElement(mouse.x, mouse.y)
            if (!element) {
                // Reset the double click target
                window.graph.doubleClickTarget = null

                // Prepare create a selection box
                startSelectionBox()
            }
        }
    },
    mouseUpCallback: (btn, mouse) => {
        if (btn === 0) {
            document.body.style.cursor = "default"
            handleSelectionPrimaryBtnUp(btn, mouse)
            
            // If the user is creating a selection box
            if (window.graph.selectionBox) {
                endSelectionBox()
            }
        }
    },
    mouseMoveCallback: (e, mouse) => {
        // If the left mouse button is pressed
        if (window.cvs.mouseDown === 0) {
            handleSelectDragging(e, mouse)

            // If the user is creating a selection box
            if (window.graph.selectionBox) {
                updateSelectionBox(mouse)
            }
        }
    },
    mouseDoubleClickCallback: () => {
        if (window.cvs.debug) console.log('Double click from tool')
    },
    keyDownCallback: (key) => {
        if (key === "KeyZ") window.ctx.scale(1.1, 1.1)
    },
}