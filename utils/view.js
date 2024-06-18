import { panTo } from "../../canvas/utils/pan"
import { getViewBox, zoomToFit } from "../../canvas/utils/zoom"

export function focusOnElement(element) {
    // // Get the element's bounding box
    const {x: eX, y: eY} = element

    // // Get the current viewbox
    const {width, height} = getViewBox()

    // // Calculate the new viewbox
    const newX = eX - width / 2
    const newY = eY - height / 2

    panTo(newX, newY)
}

export function focusOnAll(){
    let x1 = Infinity
    let y1 = Infinity
    let x2 = -Infinity
    let y2 = -Infinity

    for (const node of window.graph.nodes){
        x1 = Math.min(x1, node.x-node.r*2)
        y1 = Math.min(y1, node.y-node.r*2)
        x2 = Math.max(x2, node.x+node.r*2)
        y2 = Math.max(y2, node.y+node.r*2)
    }

    const width = x2 - x1
    const height = y2 - y1
    
    // Adjust the zoom level to fit all the nodes
    zoomToFit(width, height)

    // Calculate the new viewbox
    const {width: canvasWidth, height: canvasHeight} = getViewBox()
    const newX = x1 - (canvasWidth - width) / 2
    const newY = y1 - (canvasHeight - height) / 2

    panTo(newX, newY)
}