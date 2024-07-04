import { handleSelectDragging, startDragging, stopDragging } from "../dragging"
import { closestHoverElement } from "../find_elements"
import { recordMemento } from "../memento"
import { endSelectionBox, handleSelectionPrimaryBtnDown, handleSelectionPrimaryBtnUp, startSelectionBox, updateSelectionBox } from "../selection"

export default {
    mouseDownCallback: (btn, mouse) => {
        if (btn === 0) {
            recordMemento()
            handleSelectionPrimaryBtnDown(btn, mouse)

            const element = closestHoverElement(mouse.x, mouse.y)
            
            // If the user clicked an element, prepare to drag it. If not, prepare to create a selection box
            if (element && window.graph.selected) window.graph.isDraggingElements = undefined // Prepare to drag the element (undefined means that the user may drag the element, but it is not dragging yet)
            else startSelectionBox() // Prepare create a selection box
        }
    },
    mouseUpCallback: (btn, mouse) => {
        if (btn === 0) {
            document.body.style.cursor = "default"

            if (window.graph.isDraggingElements || window.graph.isDraggingElements === undefined) {
                stopDragging()
                return
            }

            // If the user is creating a selection box
            if (window.graph.selectionBox) {
                endSelectionBox()
                return
            }

            handleSelectionPrimaryBtnUp(btn, mouse)
        }
    },
    mouseMoveCallback: (e, mouse) => {
        // If the left mouse button is pressed
        if (window.cvs.mouseDown === 0) {
            if (window.graph.isDraggingElements === undefined) startDragging()
            if (window.graph.isDraggingElements) handleSelectDragging(e, mouse)

            // If the user is creating a selection box
            if (window.graph.selectionBox) {
                updateSelectionBox(mouse)
            }
        }

    },
    mouseDoubleClickCallback: () => {
        if (window.cvs.debug) console.log('Double click from tool')
    },
    blurCallback: () => {
        if (window.graph.isDraggingElements) stopDragging()
        if (window.graph.selectionBox) endSelectionBox()
    },
}