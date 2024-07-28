import constants from "./constants"
import { undo, redo, recordMemento } from "./memento"
import { setActivateToolByKeyCode, isTool } from "./tools/tools_callbacks"
import { isPanning, panBy, startPanning, stopPanning } from "../canvas-component/utils/pan"
import { checkShortcut } from "../canvas-component/utils/keyboard"
import { saveToCache } from "./cache"

/**
 * Handles the keyboard down shortcuts.
 * 
 * @param {String} code KeyCode of the key pressed. e.g. "KeyA", "KeyZ", "Escape"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutKeyDown(code) {

    // The key pressed represents a tool
    if (isTool(code)) {
        setActivateToolByKeyCode(code)
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

        if (checkShortcut("shift")){
            window.graph.snapToGrid = true
        }

        // --- Single tap keys ---

        // Reset all states
        if (checkShortcut("control+alt+z")) {
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
            // Memento
            recordMemento()  
            
            // Delete the hovered edges, if any
            window.graph.getElements().forEach(e => {
                if (e.selected) e.delete()
            })

            // Cache
            saveToCache()
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

    // If the user releases the shift key, disable the snap to grid
    if (constants.SNAP_TO_GRID_KEYS.includes(code)) {
        window.graph.snapToGrid = false
    }

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
        panBy(e.despX, e.despY)

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