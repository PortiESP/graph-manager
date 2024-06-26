import constants from "./constants"
import { undo, redo, recordMemento } from "./memento"
import { deselectAll, endSelectionBox, startSelectionBox, updateSelectionBox } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"
import { resetZoom } from "../canvas-component/utils/zoom"
import { isPanning, panBy, resetPan, startPanning, stopPanning } from "../canvas-component/utils/pan"
import { checkShortcut } from "../canvas-component/utils/keyboard"
import { closestHoverElement } from "./find_elements"

/**
 * Handles the keyboard down shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutKeyDown(code) {

    // The key pressed represents a tool
    if (isTool(code)) {
        activateToolByKeyCode(code)
        return true
    }
    // The key pressed is not a tool, check for GLOBAL shortcuts (custom shortcuts are handled by the active tool keyDownCallback)
    else {
        // --- First we check the keys that are used by pressing them ---

        // Move the selected elements
        if (checkShortcut("arrow")) {
            // Move the selected elements
            window.graph.selected.forEach(e => {
                if (code === "ArrowUp") e.moveBy(0, -1)
                else if (code === "ArrowDown") e.moveBy(0, 1)
                else if (code === "ArrowLeft") e.moveBy(-1, 0)
                else if (code === "ArrowRight") e.moveBy(1, 0)
            })
            return true
        }

        // --- Single tap keys ---

        // Reset all states
        if (checkShortcut("Escape")) {
            window.graph.resetAll()
            return true
        }

        // Reload the page
        if (checkShortcut("control+r")) {
            location.reload()
            return true
        }

        // Select all elements
        if (checkShortcut("control+a")) {
            window.graph.nodes.forEach(n => n.select())
            window.graph.edges.forEach(e => e.select())
            return true
        }

        // Undo
        if (checkShortcut("control+z")) {
            undo()
            return true
        }

        // Redo
        if (checkShortcut("control+shift+z") || checkShortcut("control+y")) {
            redo()
            return true
        }

        // Arrow keys
        if (checkShortcut("control+arrow")) {
            // Move the selected elements
            if (code === "ArrowUp") {
                panBy(0, 50)
            }
            else if (code === "ArrowDown") {
                panBy(0, -50)
            }
            else if (code === "ArrowLeft") {
                panBy(50, 0)
            }
            else if (code === "ArrowRight") {
                panBy(-50, 0)
            }
            return true
        }

        // If the user presses the delete/supr key, delete the hovered elements
        if (checkShortcut(constants.DELETE_KEY)) {
            recordMemento()  // Record the current state before deleting the elements

            // Delete the hovered edges, if any
            window.graph.getElements().forEach(e => {
                if (e.selected) e.delete()
            })
        }

        // If the user presses the N key, start creating a new node
        if (checkShortcut(constants.NODE_CREATION_KEY)) {
            window.graph.newNode = true
        }

    }

    return false
}

/**
 * Handles the keyboard up shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutKeyUp(code) {
    // Pan key
    // if (checkShortcut(constants.PAN_KEY)) {
    //     document.body.style.cursor = "default"
    //     return true
    // }

    return false
}

/**
 * Handles the mouse down shortcuts.
 * 
 * @param {number} button - The button that was pressed.
 * @param {Object} mouse - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutMouseDown(button, mouse) {
    // If the user is creating a new node, drop it on the canvas
    if (button === 0 && window.graph.newNode) {
        window.graph.addNodeToGraph(window.cvs.x, window.cvs.y)
        window.graph.stopCreatingNode()
        return
    }

    return false
}

/**
 * Handles the mouse up shortcuts.
 * 
 * @param {number} button - The button that was released.
 * @param {Object} coords - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutMouseUp(button, coords) {
    // If the user is panning the canvas
    if (isPanning()) {
        stopPanning()
    }

    return false
}

/**
 * Handles the mouse move shortcuts.
 * 
 * @param {Object} e - The mouse event.
 * @param {Object} coords - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutMouseMove(e, coords) {
    // If the used double clicked in an empty space of the canvas, pan the canvas
    if (window.cvs.doubleClick){
        panBy(e.movementX, e.movementY)

        return true
    }

    return false
}

/**
 * Handles the mouse scroll shortcuts.
 * 
 * @param {number} delta - The delta of the scroll.
 * @param {Object} mouse - The mouse event.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function. In this case, the default action is to zoom in or out, so it always returns true.
 */
export function handleShortcutMouseScroll(delta, mouse) {
    return true
}

/**
 * Handles the mouse double click shortcuts.
 * 
 * @param {Object} e - The mouse event.
 * @param {Object} mouse - The mouse event.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutDoubleClick(e, mouse) {
    
    startPanning()

    return false
}