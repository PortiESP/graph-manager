import { undo, redo } from "./memento"
import { deselectAll } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"

/**
 * Handles the keyboard shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcuts(code) {
    // The key pressed represents a tool
    if (isTool(code)) {
        activateToolByKeyCode(code)
        return true
    }
    // The key pressed is not a tool
    else{
        // Reset all states
        if (code === 'Escape') {
            deselectAll()
            window.graph.newEdgeScr = null
            window.graph.newNode = false
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
    }

    return false
}