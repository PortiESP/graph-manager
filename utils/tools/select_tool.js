import { handleSelectDragging } from "../dragging"
import { recordMemento } from "../memento"
import { handleSelectionPrimaryBtnDown, handleSelectionPrimaryBtnUp } from "../selection"

export default {
    mouseDownCallback: (btn, mouse) => {
        if (btn === 0) {
            recordMemento()
            handleSelectionPrimaryBtnDown(btn, mouse)
        }
    },
    mouseUpCallback: (btn, mouse) => {
        if (btn === 0) handleSelectionPrimaryBtnUp(btn, mouse)
    },
    mouseMoveCallback: (e, mouse) => {
        // If the left mouse button is pressed
        if (window.cvs.mouseDown === 0) {
            handleSelectDragging(e, mouse)
        }
    },
    mouseDoubleClickCallback: () => {
        if (window.cvs.debug) console.log('Double click from tool')
    },
    keyDownCallback: (key) => {
        if (key === "KeyZ") window.ctx.scale(1.1, 1.1)
    },
}