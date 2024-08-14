import { GraphGlobals } from "../globals";
import constants from "./constants";
import { setActivateTool } from "./tools/tools_callbacks";

export default function setupGraph(){
    window.graph = new GraphGlobals()

    // --- Setup ---
    setActivateTool(constants.DEFAULT_TOOL)
}