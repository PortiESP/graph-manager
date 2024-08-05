import { loadFromJSON } from "./load_graph"


/**
 * Copy the selected nodes and edges to the clipboard
 */
export function copyToClipboard(){

    // Get the selected nodes
    const selectedNodes = window.graph.selected.filter(e => e.constructor.name === "Node")
    const n = selectedNodes.length
    if (n === 0) return // If there are no selected nodes, return

    // Calculate the center position of all the selected nodes to paste them in the same relative position
    const meanX = selectedNodes.reduce((acc, e) => acc + e.x, 0) / n
    const meanY = selectedNodes.reduce((acc, e) => acc + e.y, 0) / n

    // Data object that will be copied to the clipboard
    const data = {
        nodes: [],
        edges: [],
        mouseX: meanX,
        mouseY: meanY
    }
    // Add the selected nodes and edges to the data object
    window.graph.selected.forEach(e => {
        if (e.constructor.name === "Node") data.nodes.push(e)
        else if (e.constructor.name === "Edge") data.edges.push({...e, src: e.src.id, dst: e.dst.id})  // Copy the edge with the ids of the nodes instead of the nodes themselves
    })

    // Convert the data object to a JSON string
    const json = JSON.stringify(data)

    // Copy to clipboard
    navigator.clipboard.writeText(json)
        .then(() => window.cvs.debug && console.log('Copied to clipboard: ', data))  // Success
        .catch(err => console.error('Failed to copy', err))                          // Error
}


/**
 * Paste the nodes and edges from the clipboard to the graph
 */
export function pasteFromClipboard(){
    // ------------ Helper functions ------------
    // Ensure that the id is unique by adding "_copy" to the end of the id and a number if it already exists: "_copy2", "_copy3", ...
    const fixId = (element) => {
        let id = element._id + "_copy"  // Id of the new element (pending to check if a number should be added)

        let i = 2  // Start with 2, since the first copy will be just: "_copy"
        let auxID = id  // Copy the id to an auxiliary where the number will be added
        while (window.graph.findElementById(auxID)) {  // While the id already exists, update the auxiliary variable with the new id with the number incremented
            auxID = id + i
            i++ // Increment the number
        }

        // Update the id of the element with the new valid id
        element._id = auxID
        return true
    }

    // Move the element the same distance that the mouse moved since the copy action
    const fixPosition = (element, mouse) => {
        element._x += window.cvs.x - mouse.x
        element._y += window.cvs.y - mouse.y
    }

    // Update the src and dst of the copied edge to point to the new copied nodes, return false if any of the nodes is missing in the copy (due to not being selected).
    // This means that the edge should not be copied if any of the src or dst nodes was not selected during the copy action.
    const fixEdgeNodes = (edge, newIds) => {
        edge.src = newIds[edge.src]  // Update the src with the new id of the node
        edge.dst = newIds[edge.dst]  // Update the dst with the new id of the node
        // If any of the nodes is missing, return false (the edge should not be copied)
        if (edge.src === undefined || edge.dst === undefined) return false

        // If the edge is valid, return true after updating the ids of the nodes
        return true
    }

    // Get the clipboard content
    navigator.clipboard.readText()
        .then(text => {
            let data;
            try {
                // Parse the content
                data = JSON.parse(text)
                // Check if the content is valid
                if (!validateContent(data)) throw new Error('Invalid clipboard content')
            } catch (error) {
                return console.error('Failed to parse clipboard content', error)   
            }

            // Create a map to store the original and new ids: {originalId: newId}
            const nodesIds = {}

            // Parse the nodes from the clipboard and store them in a separated array
            const pasteNodes = data.nodes.map(e => {
                const originalId = e._id  // Store the original id
                fixId(e)  // Fix the id of the node (add "_copy" to the end)
                nodesIds[originalId] = e._id // Store the original and new id in the map (will be used to update the edges)
                fixPosition(e, {x: data.mouseX, y: data.mouseY})  // Move the node by a relative distance
                return e  // Return the node after the updates
            })

            // Parse the edges from the clipboard and store them in a separated array
            const pasteEdges = data.edges.map(e => {
                fixId(e)  // Fix the id of the edge (add "_copy" to the end)
                if (!fixEdgeNodes(e, nodesIds)) return undefined  // Update the src and dst of the edge, return undefined if any of the nodes is missing
                return e  // Return the edge after the updates
            }).filter(e => e)  // Filter out the edges that wont be copied

            // Append the elements to the graph
            loadFromJSON({nodes: pasteNodes, edges: pasteEdges}, true)
        })
        .catch(err => console.error('Failed to read clipboard', err))
}


/**
 * Validate the content of the clipboard
 * 
 * @param {object} data - The data object to validate
 * 
 * @returns {boolean} True if the content is valid, false otherwise
 */
export function validateContent(data){
    if (!data.nodes || !data.edges) return false
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false
    if (data.nodes.some(e => !e.id && !e._id)) return false
    if (data.edges.some(e => !e.src && !e.dst)) return false

    return true
}