import { isDragging, resetDrag } from "./dragging"
import { undo, redo } from "./memento"
import { deselectAll } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"
import { getViewBox, resetZoom, zoomIn, zoomOut } from "./zoom"

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
    else {
        // --- First we check the keys that are used by pressing them ---

        // Drag
        if (code === "Space") {
            if (document.body.style.cursor !== "grabbing") document.body.style.cursor = "grab"
            return true
        }

        // Arrow keys
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
        if (code === 'Escape') {
            deselectAll()
            window.graph.newEdgeScr = null
            window.graph.newNode = false
            resetDrag()
            resetZoom()
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
                window.graph.canvasDragOffset.y -= 50
                window.ctx.translate(0, -50)
            }
            else if (code === "ArrowDown") {
                window.graph.canvasDragOffset.y += 50
                window.ctx.translate(0, 50)
            }
            else if (code === "ArrowLeft") {
                window.graph.canvasDragOffset.x -= 50
                window.ctx.translate(-50, 0)
            }
            else if (code === "ArrowRight") {
                window.graph.canvasDragOffset.x += 50
                window.ctx.translate(50, 0)
            }
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
    if (isDragging()) {
        document.body.style.cursor = "grabbing"
        return true
    }

    return false
}

export function handleShortcutsMouseUp(button, coords) {
    // Drag
    if (isDragging()) {
        document.body.style.cursor = "grab"
        return true
    }
    // Release the drag
    if (button === 1) {
        document.body.style.cursor = "default"
        return true
    }

    return false
}

export function handleShortcutsMouseMove(e, coords) {
    console.log(getViewBox())

    // Drag the canvas
    if (isDragging()) {
        const { movementX: dx, movementY: dy } = e
        window.graph.canvasDragOffset = { x: window.graph.canvasDragOffset.x + dx, y: window.graph.canvasDragOffset.y + dy }
        window.ctx.translate(dx, dy)

        return true
    }

    return false
}


export function handleShortcutsMouseScroll(delta, mouse) {
    // Zoom in and out
    if (delta < 0) zoomIn()
    else if (delta > 0) zoomOut()

    return true
}