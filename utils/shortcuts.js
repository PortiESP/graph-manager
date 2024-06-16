import { undo, redo } from "./memento"
import { deselectAll } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"

/**
 * Handles the keyboard shortcuts.
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
    else{
        // --- First we check the keys that are used by pressing them ---

        // Drag
        if (code === "Space") {
            if (document.body.style.cursor !== "grabbing") document.body.style.cursor = "grab"
            return true
        }

        // --- Single tap keys ---

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

/**
 * Handles the keyboard shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutsKeyUp(code) {
    // Drag
    if (code === "Space") {
        document.body.style.cursor = "default"
        return true
    }

    return false
}

export function handleShortcutsMouseDown(button, coords) {
    // Drag
    if (button === 0 && window.cvs.keysDown["Space"]) {
        document.body.style.cursor = "grabbing"
        return true
    }

    return false
}

export function handleShortcutsMouseUp(button, coords) {
    // Drag
    if (button === 0 && window.cvs.keysDown["Space"]) {
        document.body.style.cursor = "grab"
        return true
    }

    return false
}

export function handleShortcutsMouseMove(e, coords) {
    // Drag the canvas
    if (window.cvs.mouseDown === 0 && window.cvs.keysDown["Space"]) {
        const {movementX: dx, movementY: dy} = e
        window.cvs.canvasDragOffset = {x: window.cvs.canvasDragOffset.x + dx, y: window.cvs.canvasDragOffset.y + dy}
        window.ctx.translate(dx, dy)

        return true
    }

    return false
}