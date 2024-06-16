import CONSTANTS from "../constants"
import { handleShortcutsMouseDown, handleShortcutsKeyDown, handleShortcutsKeyUp, handleShortcutsMouseUp, handleShortcutsMouseMove, handleShortcutsMouseScroll } from "../shortcuts"
import edit_tool from "./edit_tool"
import select_tool from "./select_tool"

// Tool object with the callbacks for each tool. The keys are the tool names and the values are objects with the callbacks for each tool.
export const toolsCallbacks = {
    "select": select_tool,
    "edit": edit_tool,
}

/**
 * This function returns the callback for the active tool requested by the callback name provided.
 * 
 * @param {String} cbkName Name of the callback. e.g. "mouseDownCallback"
 * @returns The callback for the active tool
 */
export function activeToolCallback(cbkName) {

    // Return a callback that calls the specified tool callback
    return (...params) => {
        // Get the callback for the active tool
        let callback = toolsCallbacks[window.graph.tool][cbkName]

        // Default actions
        // First, run the handleShortcuts function to run the default shortcuts, if a default action was executed inside this default functions, return (prevent the tool callback from being called)
        if (cbkName === "keyDownCallback") if (handleShortcutsKeyDown(...params)) return
        if (cbkName === "keyUpCallback") if (handleShortcutsKeyUp(...params)) return
        if (cbkName === "mouseDownCallback") if (handleShortcutsMouseDown(...params)) return 
        if (cbkName === "mouseUpCallback") if (handleShortcutsMouseUp(...params)) return
        if (cbkName === "mouseMoveCallback") if (handleShortcutsMouseMove(...params)) return
        if (cbkName === "mouseScrollCallback") if (handleShortcutsMouseScroll(...params)) return
        
        // If the callback exists, call it
        if (callback) {
            callback(...params)
            return
        }

        // If the callback does not exist, call the default callback
        if (toolsCallbacks["select"][cbkName]) toolsCallbacks["select"][cbkName](...params)

        // If the default callback does not exist, do nothing
    }
}


// Tool methods
export function isTool(code){
    if (anySpecialKeyPressed()) return false
    return !!CONSTANTS.TOOLS_KEYS[code]
}

export function anySpecialKeyPressed(){
    if (window.cvs.keysDown["ControlLeft"] || window.cvs.keysDown["ControlRight"]) return true
    if (window.cvs.keysDown["AltLeft"] || window.cvs.keysDown["AltRight"]) return true
    if (window.cvs.keysDown["ShiftLeft"] || window.cvs.keysDown["ShiftRight"]) return true
    return false
}

export function activateTool(tool){
    // Reset the tool states before changing the tool (the if avoids calling the clean method before the first tool is set)
    if (window.graph.tool) activeToolCallback('clean')()

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