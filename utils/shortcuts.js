import constants from "./constants"
import { undo, redo } from "./memento"
import { deselectAll } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"
import { resetZoom } from "../../canvas/utils/zoom"
import { panBy, resetPan } from "../../canvas/utils/pan"

/**
 * Handles the keyboard down shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsKeyDown(code) {

    // The key pressed represents a tool
    if (isTool(code)) {
        activateToolByKeyCode(code)
        return true
    }
    // The key pressed is not a tool, check for GLOBAL shortcuts (custom shortcuts are handled by the active tool keyDownCallback)
    else {
        // --- First we check the keys that are used by pressing them ---

        // Move the selected elements
        if (!window.cvs.keysDown["ControlLeft"])
        if (code === "ArrowUp" || code === "ArrowDown" || code === "ArrowLeft" || code === "ArrowRight") {
            // Move the selected elements
            window.graph.selected.forEach(e => {
                if (code === "ArrowUp") e.moveBy(0, -1)
                if (code === "ArrowDown") e.moveBy(0, 1)
                if (code === "ArrowLeft") e.moveBy(-1, 0)
                if (code === "ArrowRight") e.moveBy(1, 0)
            })
            return true
        }

        // --- Single tap keys ---

        // Reset all states
        if (code === constants.RESET) {
            deselectAll()  // Deselect all nodes
            window.graph.newEdgeScr = null  // Reset the edge creation
            window.graph.newNode = false    // Reset the node creation
            resetPan() // Reset the drag, go to the (0, 0) position
            resetZoom() // Reset the zoom level to 1
            return true
        }

        // Reload the page
        if (code === "KeyR" && window.cvs.keysDown["ControlLeft"]) {
            location.reload()
            return true
        }

        // Select all elements
        if (code === "KeyA" && window.cvs.keysDown["ControlLeft"]) {
            window.graph.nodes.forEach(n => n.select())
            window.graph.edges.forEach(e => e.select())
            return true
        }

        // Undo
        if (code === "KeyZ" && window.cvs.keysDown["ControlLeft"] && !window.cvs.keysDown["ShiftLeft"]) {
            undo()
            return true
        }

        // Redo
        const ctrlY = code === "KeyY" && window.cvs.keysDown["ControlLeft"]
        const ctrlShiftZ = code === "KeyZ" && window.cvs.keysDown["ControlLeft"] && window.cvs.keysDown["ShiftLeft"]
        if (ctrlShiftZ || ctrlY) {
            redo()
            return true
        }

        // Arrow keys
        if (window.cvs.keysDown["ControlLeft"] && code.includes("Arrow")) {
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



    }

    return false
}

/**
 * Handles the keyboard up shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsKeyUp(code) {
    // Pan key
    if (code === constants.PAN_KEY) {
        document.body.style.cursor = "default"
        return true
    }

    return false
}

/**
 * Handles the mouse down shortcuts.
 * 
 * @param {number} button - The button that was pressed.
 * @param {Object} coords - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsMouseDown(button, coords) {
    return false
}

/**
 * Handles the mouse up shortcuts.
 * 
 * @param {number} button - The button that was released.
 * @param {Object} coords - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsMouseUp(button, coords) {
    return false
}

/**
 * Handles the mouse move shortcuts.
 * 
 * @param {Object} e - The mouse event.
 * @param {Object} coords - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsMouseMove(e, coords) {
        return false
}

/**
 * Handles the mouse scroll shortcuts.
 * 
 * @param {number} delta - The delta of the scroll.
 * @param {Object} mouse - The mouse event.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function. In this case, the default action is to zoom in or out, so it always returns true.
 */
export function handleShortcutsMouseScroll(delta, mouse) {
    return true
}