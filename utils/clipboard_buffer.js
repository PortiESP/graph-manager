import { loadFromJSON } from "./load_graph"

export function copyToClipboard(){

    const selectedNodes = window.graph.selected.filter(e => e.constructor.name === "Node")
    const n = selectedNodes.length
    if (n === 0) return

    // Calculate the center position of all the selected nodes to paste them in the same relative position
    const meanX = selectedNodes.reduce((acc, e) => acc + e.x, 0) / n
    const meanY = selectedNodes.reduce((acc, e) => acc + e.y, 0) / n

    const data = {
        nodes: [],
        edges: [],
        mouseX: meanX,
        mouseY: meanY
    }
    window.graph.selected.forEach(e => {
        if (e.constructor.name === "Node") data.nodes.push(e)
        else if (e.constructor.name === "Edge") data.edges.push({...e, src: e.src.id, dst: e.dst.id})
    })

    const json = JSON.stringify(data)

    // Copy to clipboard
    navigator.clipboard.writeText(json)
        .then(() => window.cvs.debug && console.log('Copied to clipboard: ', data))
        .catch(err => console.error('Failed to copy', err))
}


export function pasteFromClipboard(){
    // Ensure that the id is unique
    const fixId = (element) => {
        let id = element._id + "_copy"

        let i = 2  // Start with 2, since the first copy will be "_copy"
        let auxID = id
        while (window.graph.findElementById(auxID)) {
            auxID = id + i
            i++
        }

        element._id = auxID
        return true
    }

    // Move the element the same distance that the mouse moved since the copy action
    const fixPosition = (element, mouse) => {
        element._x += window.cvs.x - mouse.x
        element._y += window.cvs.y - mouse.y
    }

    // Ensure that the edge nodes are the same as the copied nodes
    const fixEdgeNodes = (edge, newIds) => {
        edge.src = newIds[edge.src]
        edge.dst = newIds[edge.dst]
        if (edge.src === undefined || edge.dst === undefined) return false

        return true
    }

    // Get the clipboard content
    navigator.clipboard.readText()
        .then(text => {
            // Parse the content
            let data;
            try {
                data = JSON.parse(text)
                // Check if the content is valid
                if (!validateContent(data)) throw new Error('Invalid clipboard content')
            } catch (error) {
                return console.error('Failed to parse clipboard content', error)   
            }

            // Create a map to store the original and new ids
            const nodesIds = {}

            const pasteNodes = data.nodes.map(e => {
                const originalId = e._id
                fixId(e)
                nodesIds[originalId] = e._id
                fixPosition(e, {x: data.mouseX, y: data.mouseY})
                return e
            })

            // Paste the elements
            const pasteEdges = data.edges.map(e => {
                fixId(e)
                if (!fixEdgeNodes(e, nodesIds)) return undefined
                return e
            }).filter(e => e)

            // Add the elements to the graph
            loadFromJSON({nodes: pasteNodes, edges: pasteEdges}, true)
        })
        .catch(err => console.error('Failed to read clipboard', err))
}



export function validateContent(data){
    if (!data.nodes || !data.edges) return false
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) return false
    if (data.nodes.some(e => !e.id && !e._id)) return false
    if (data.edges.some(e => !e.src && !e.dst)) return false

    return true
}