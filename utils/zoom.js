import constants from "./constants"

export function resetZoom(){
    window.ctx.scale(1/window.graph.zoom, 1/window.graph.zoom)
}

export function zoomIn(){
    const zoomFactor = constants.ZOOM_FACTOR
    window.ctx.scale(zoomFactor, zoomFactor)
    window.graph.zoom *= zoomFactor

    // Disable the canvas drag towards the cursor
    // const { x, y } = window.cvs
    // const dx = window.cvs.$canvas.width*constants.ZOOM_FACTOR
    // window.graph.canvasDragOffset = { x: window.graph.canvasDragOffset.x - x, y: window.graph.canvasDragOffset.y - y }
}

export function zoomOut(){
    const zoomFactor = 1/constants.ZOOM_FACTOR
    window.ctx.scale(zoomFactor, zoomFactor)
    window.graph.zoom *= zoomFactor
}