import { handleShortcutMouseDown, handleShortcutKeyDown, handleShortcutKeyUp, handleShortcutMouseUp, handleShortcutMouseMove, handleShortcutMouseScroll, handleShortcutDoubleClick } from "../shortcuts"
import add_nodes_tool from "./add_nodes_tool"
import edges_tool from "./edges_tool"
import select_tool from "./select_tool"
import delete_tool from "./delete_tool"

// Tool object with the callbacks for each tool. The keys are the tool names and the values are objects with the callbacks for each tool.
export const toolsCallbacks = {
    "select": select_tool,
    "edges": edges_tool,
    "add-nodes": add_nodes_tool,
    "delete": delete_tool,
}

/**
 * This function returns the callback for the active tool requested by the callback name provided.
 * 
 * @param {String} cbkName Name of the callback. e.g. "mouseDownCallback"
 * @returns The callback for the active tool
 */
export function getActiveToolCallback(cbkName) {

    // Return a callback that calls the specified tool callback
    return (...params) => {
        // Get the callback for the active tool
        let callback = toolsCallbacks[window.graph.tool][cbkName]

        // --- Default actions ---
        let preventDefault = false
        // First, run the handleShortcut function to run the default shortcuts, if a default action was executed inside this default functions, return (prevent the tool callback from being called)
        if (cbkName === "mouseMoveCallback") {if (handleShortcutMouseMove(...params)) preventDefault = true}
        else if (cbkName === "mouseDoubleClickCallback") {if (handleShortcutDoubleClick(...params)) preventDefault = true}
        else if (cbkName === "mouseDownCallback") {if (handleShortcutMouseDown(...params)) preventDefault = true }
        else if (cbkName === "mouseUpCallback") {if (handleShortcutMouseUp(...params)) preventDefault = true}
        else if (cbkName === "mouseScrollCallback") {if (handleShortcutMouseScroll(...params)) preventDefault = true}
        else if (cbkName === "keyDownCallback") {if (handleShortcutKeyDown(...params)) preventDefault = true}
        else if (cbkName === "keyUpCallback") {if (handleShortcutKeyUp(...params)) preventDefault = true}
        // Other callbacks do not have default actions, such as "clean", "setup", "blurCallback"

        // --- Custom actions ---
        
        // If the callback exists, call it
        if (callback) {
            preventDefault = callback(...params)
        }

        return preventDefault
    }
}

/**
 * This function sets the active tool.
 * 
 * @param {String} tool Tool to set as active. E.G.: "select"
 */
export function setActivateTool(tool){
    // Reset the tool states before changing the tool (the if avoids calling the clean method before the first tool is set)
    if (window.graph.tool) getActiveToolCallback('clean')()

    // Set the current tool
    window.graph.tool = tool
    // Set the tool callbacks
    window.graph.toolCallbacks = toolsCallbacks[window.graph.tool]
    // Call the setup method of the tool
    getActiveToolCallback('setup')()
    // Trigger the tool listeners
    window.graph.triggerToolListeners()
}
