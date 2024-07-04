import { panTo } from "../canvas-component/utils/pan"
import { getViewBox, zoomToFit } from "../canvas-component/utils/zoom"
import constants from "./constants"


/**
 * Pans the canvas to focus on the given element by centering it on the screen.
 * 
 * @param {Element} element - The element to focus on
 */
export function focusOnElement(element) {
    // Get the element's position
    const {x: eX, y: eY} = element

    // Get the canvas dimensions
    const {width, height} = getViewBox()

    // Calculate the new position of the canvas
    const newX = eX - width / 2
    const newY = eY - height / 2

    // Pan to the new position
    panTo(newX, newY)
}


/**
 * Pans the canvas to focus on all the elements by centering them on the screen.
 */
export function focusOnAllNodes(zoom=true){

    // If no nodes are present, return
    if (window.graph.nodes.length === 0) return

    // Get the bounding box of all the nodes
    let {x1, y1, width, height} = getBoundingBoxOfAllNodes()
    x1 -= constants.FOCUS_MARGIN
    y1 -= constants.FOCUS_MARGIN
    width += 2 * constants.FOCUS_MARGIN
    height += 2 * constants.FOCUS_MARGIN
    
    // Adjust the zoom level to fit all the nodes
    if (zoom) zoomToFit(width, height)

    // Calculate the new position of the canvas
    const {width: canvasWidth, height: canvasHeight} = getViewBox()
    const newX = x1 - (canvasWidth - width) / 2
    const newY = y1 - (canvasHeight - height) / 2

    // Pan to the new position
    panTo(newX, newY)
}

export function getBoundingBoxOfAllNodes(){
    let x1 = Infinity
    let y1 = Infinity
    let x2 = -Infinity
    let y2 = -Infinity
    const graph = window.graph

    // Iterate over all the nodes to get the coordinates of a bounding box that contains all the nodes
    for (const node of graph.nodes){
        if (node.x === undefined || node.y === undefined) continue
        x1 = Math.min(x1, node.x-node.r)
        y1 = Math.min(y1, node.y-node.r)
        x2 = Math.max(x2, node.x+node.r)
        y2 = Math.max(y2, node.y+node.r)
    }

    // Dimensions of the bounding box
    const width = x2 - x1
    const height = y2 - y1

    return {x1, y1, x2, y2, width, height}
}