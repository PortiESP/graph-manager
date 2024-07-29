import { undo, redo, recordMemento } from "./memento"
import { setActivateTool } from "./tools/tools_callbacks"
import { isPanning, panBy, startPanning, stopPanning } from "../canvas-component/utils/pan"
import { getKeyFromCode, getPressedShortcut } from "../canvas-component/utils/keyboard"
import { saveToCache } from "./cache"


const SHORTCUTS_KEY_DOWN = {
    // Undo and redo
    "control+z": undo,
    "control+shift+z": redo,
    "control+y": redo,

    // Select all elements
    "control+a": () => window.graph.getElements().forEach(e => e.select()),

    // Reload the page
    "control+r": () => location.reload(),

    // Move the selected elements
    "arrowleft": () => window.graph.selected.forEach(e => e.moveBy(-1, 0)),
    "arrowright": () => window.graph.selected.forEach(e => e.moveBy(1, 0)),
    "arrowup": () => window.graph.selected.forEach(e => e.moveBy(0, -1)),
    "arrowdown": () => window.graph.selected.forEach(e => e.moveBy(0, 1)),

    // Activate snap to grid
    "shift": () => window.graph.snapToGrid = true,

    // Reset all states
    "control+alt+z": () => window.graph.resetAll(),

    // Pan the canvas
    "control+arrowleft": () => panBy(50, 0),
    "control+arrowright": () => panBy(-50, 0),
    "control+arrowup": () => panBy(0, 50),
    "control+arrowdown": () => panBy(0, -50),

    // Delete the hovered elements
    "delete": () => {
        recordMemento()  // Memento
        window.graph.getElements().forEach(e => e.selected && e.delete()) // Delete the hovered edges, if any
        saveToCache()  // Cache
    },

    // Tools
    "s": () => setActivateTool("select"),
    "escape": () => setActivateTool("select"),
    "e": () => setActivateTool("edges"),
    "n": () => setActivateTool("add-nodes"),
    "d": () => setActivateTool("delete"),

    // Save options
    "control+s": () => saveToCache(),
    "control+shift+s": () => window.ui.setModal("save_graph"),

    // Load options
    "control+o": () => window.ui.setModal("load_graph"),

    // Export options
    "control+shift+e": () => window.ui.setModal("export_graph"),

    // Empty graph
    "control+alt+n": () => window.graph.reset(),

}

const SHORTCUTS_KEY_UP = {
    "shift": () => window.graph.snapToGrid = false,
}


/**
 * Handles the keyboard down shortcuts.
 * 
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutKeyDown(){
    const shortcut = getPressedShortcut()
    const shortcutCallback = SHORTCUTS_KEY_DOWN[shortcut]

    if (shortcutCallback) {
        if (window.cvs.debug) console.log("Shortcut: ", shortcut)
        shortcutCallback(shortcut)
    }
}


/**
 * Handles the keyboard up shortcuts.
 * 
 * @param {String} code - The code of the key that was released. E.G.: "KeyA"
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutKeyUp(code) {
    const key = getKeyFromCode(code)
    const shortcutCallback = SHORTCUTS_KEY_UP[key]

    if (shortcutCallback) {
        if (window.cvs.debug) console.log("Shortcut up: ", key)
        shortcutCallback(key)
    }
}

/**
 * Handles the mouse down shortcuts.
 * 
 * @param {number} button - The button that was pressed.
 * @param {Object} mouse - The coordinates of the mouse.
 * @returns {Boolean} Returns a boolean representing if a default action was executed in this function.
 */
export function handleShortcutMouseDown(button, mouse) {
    // Empty
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