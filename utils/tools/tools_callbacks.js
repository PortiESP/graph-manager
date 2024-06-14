import CONSTANTS from "../constants"
import { handleShortcuts } from "../kbd_shortcuts"
import edit_tool from "./edit_tool"
import select_tool from "./select_tool"


export const toolsCallbacks = {
    "select": select_tool,
    "edit": edit_tool,
}

/**
 * This function returns the callback for the active tool requested by the callback name provided.
 * 
 * @param {String} name Name of the callback. e.g. "mouseDownCallback"
 * @returns The callback for the active tool
 */
export function activeToolCallback(name) {
    // Return a callback that calls the specified tool callback
    return (...params) => {
        // Get the callback for the active tool
        let callback = toolsCallbacks[window.graph.tool][name]

        // Ensure the shortcut callback is called
        if (name === "keyDownCallback") handleShortcuts(...params)
        
        // If the callback exists, call it
        if (callback) {
            callback(...params)
            return
        }

        // If the callback does not exist, call the default callback
        if (toolsCallbacks["select"][name]) toolsCallbacks["select"][name](...params)

        // If the default callback does not exist, do nothing
    }
}


// Tool methods
export function isTool(code){
    if (anySpecialKeyPressed()) return false
    return !!CONSTANTS.TOOLS_KEYS[code]
}

export function anySpecialKeyPressed(){
    if (window.cvs.keysDown["ControlLeft"] || window.cvs.keysDown["ControlRight"]) return false
    if (window.cvs.keysDown["AltLeft"] || window.cvs.keysDown["AltRight"]) return false
    if (window.cvs.keysDown["ShiftLeft"] || window.cvs.keysDown["ShiftRight"]) return false
    return true
}

export function activateTool(tool){
    // Set the current tool
    window.graph.tool = tool
    // Set the tool callbacks
    window.graph.toolCallbacks = toolsCallbacks[window.graph.tool]
    // Call the setup method of the tool
    activeToolCallback('setup')()
}

export function activateToolByKeyCode(code){
    // Check if the tool exists
    if (!isTool(code)) throw new Error('Invalid tool key code')
    // Set the current tool
    const tool = CONSTANTS.TOOLS_KEYS[code]
    activateTool(tool)
}

// Tools
