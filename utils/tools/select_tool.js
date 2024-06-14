import { handleSelectDragging } from "../dragging"
import { recordMemento } from "../memento"
import { handlePrimaryBtnDown, handlePrimaryBtnUp } from "../selection"

export default {
    mouseDownCallback: (btn, mouse) => {
        if (btn === 0) {
            recordMemento()
            handlePrimaryBtnDown(btn, mouse)
        }
    },
    mouseUpCallback: (btn, mouse) => {
        if (btn === 0) handlePrimaryBtnUp(btn, mouse)
    },
    mouseMoveCallback: () => {
        // If the left mouse button is pressed
        if (window.cvs.mouseDown === 0) {
            handleSelectDragging()
        }
    },
    mouseDoubleClickCallback: () => {
        console.log('Double click')
    }
}