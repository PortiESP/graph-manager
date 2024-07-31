import { saveToCache } from "../cache"
import { handleSelectDragging, startDragging, stopDragging } from "../dragging"
import { closestHoverElement } from "../find_elements"
import { recordMemento, discardLastSnapshot } from "../memento"
import { deselectAll, endSelectionBox, startSelectionBox, updateSelectionBox } from "../selection"
import { checkShortcut, handleShortcut } from "../../canvas-component/utils/keyboard"
import { copyToClipboard, pasteFromClipboard } from "../clipboard_buffer"


const SHORTCUTS_KEY_DOWN = {
    // Select all elements
    "control+a": () => window.graph.getElements().forEach(e => e.select()),

    // Copy & Paste
    "control+c": () => copyToClipboard(),
    "control+v": () => pasteFromClipboard(),
}


export default {
    // Handles the selection of elements
    mouseDownCallback: (btn, mouse) => {
        if (btn === 0) {
            // Memento
            recordMemento()

            // Find the element under the mouse
            const e = closestHoverElement()

            // If shift is pressed, allow multiple selection and prevent deselect the other nodes
            if (e && checkShortcut("shift")) e.toggleSelect() // Toggle the selection of the element
            // If shift is not pressed, allow deselect other nodes
            else {
                // If clicked on an element, select it
                if (e) {
                    // If the element is not selected, deselect all nodes and select the element
                    if (!e.selected) { deselectAll(); e.select() }
                    // The user clicked on an element while there are elements selected, prepare to drag the element
                    if (window.graph.selected) window.graph.isDraggingElements = undefined // Prepare to drag the element (undefined means that the user may drag the element, but it is not dragging yet)
                }
                // If clicked on an empty space, deselect all nodes
                else {
                    // Discard the last snapshot if nothing was selected (e.g.: when clicking on an empty space, the app will create a new snapshot, this call will discard it)
                    if (window.graph.selected.length === 0) discardLastSnapshot()
                    // Deselect all nodes
                    deselectAll()
                    // Start the selection box
                    startSelectionBox() 
                }
            }

            // Cache
            saveToCache()
        }
    },
    // Handles the end of the selection of elements
    mouseUpCallback: (btn, mouse) => {
        if (btn === 0) {
            document.body.style.cursor = "default"

            // Cache
            saveToCache()

            // If the user is dragging elements (isDraggingElements===true) or was prepared to drag elements (isDraggingElements===undefined), stop dragging. When the user is not dragging elements (isDraggingElements===false), do nothing.
            if (window.graph.isDraggingElements || window.graph.isDraggingElements === undefined) {
                stopDragging()
                return
            }

            // If the user is creating a selection box
            if (window.graph.selectionBox) {
                endSelectionBox()
                return
            }

            // Find the element under the mouse
            const e = closestHoverElement()

            // If the user clicked on an element, select it
            if (e) {
                // If the user had pressed the shift key, do nothing due to this being handled in the mouseDownCallback
                if (checkShortcut("shift")) return

                deselectAll()
                e.select()

            }
        }
    },
    // Handles the movement of the mouse
    mouseMoveCallback: (e, mouse) => {
        // If the left mouse button is pressed
        if (window.cvs.mouseDown === 0) {
            // If the user was prepared to drag elements, but not dragging yet, start dragging
            if (window.graph.isDraggingElements === undefined) startDragging()
            // If the user is dragging elements
            if (window.graph.isDraggingElements) handleSelectDragging(e, mouse)

            // If the user is creating a selection box
            if (window.graph.selectionBox) updateSelectionBox(mouse)
        }

    },
    // Handles the double click of the mouse
    mouseDoubleClickCallback: () => {
        if (window.cvs.debug) console.log('Double click from tool')
    },
    // Handles the focus of the canvas
    blurCallback: () => {
        if (window.graph.isDraggingElements) stopDragging()
        if (window.graph.selectionBox) endSelectionBox()
    },
    // Handles the keys down of the keyboard
    keyDownCallback: (code) => {
        handleShortcut(SHORTCUTS_KEY_DOWN)
    },
}