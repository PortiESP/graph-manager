import { deselectAll } from "./selection"
import { activateToolByKeyCode, isTool } from "./tools/tools_callbacks"

export function handleShortcuts(code) {
    // The key pressed represents a tool
    if (isTool(code)) activateToolByKeyCode(code)
    // The key pressed is not a tool
    else{
        // Reset all states
        if (code === 'Escape') {
            deselectAll()
            window.graph.newEdgeScr = null
            window.graph.newNode = false
        }

        // Reload the page
        if (code === "KeyR" && window.cvs.keysDown["ControlLeft"]) {
            location.reload()
        }

        // Select all elements
        if (code === "KeyA" && window.cvs.keysDown["ControlLeft"]) {
            window.graph.nodes.forEach(n => n.select())
            window.graph.edges.forEach(e => e.select())
        }
    }
}