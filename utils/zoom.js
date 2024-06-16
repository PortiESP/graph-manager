import constants from "./constants"

export function resetZoom(){
    window.ctx.scale(1/window.graph.zoom, 1/window.graph.zoom)
}

export function zoomIn(){
    const zoomFactor = constants.ZOOM_FACTOR
    const zoomStep = zoomFactor-1
    window.ctx.scale(zoomFactor, zoomFactor)
    window.graph.zoom *= zoomFactor

    // Displace the canvas to the center of the screen
    const ref = {x: 0, y: 0}
    const dragOffset = window.graph.canvasDragOffset
    const diff = {x: ref.x - dragOffset.x, y: ref.y - dragOffset.y}

    // const dx = diff.x*zoomStep
    // const dy = diff.y*zoomStep
    // window.graph.canvasDragOffset.x += dx
    // window.graph.canvasDragOffset.y += dy

    // window.ctx.translate(dx, dy)

}

export function zoomOut(){
    const zoomFactor = 1/constants.ZOOM_FACTOR
    const zoomStep = constants.ZOOM_FACTOR-1
    window.ctx.scale(zoomFactor, zoomFactor)
    window.graph.zoom *= zoomFactor

    // Displace the canvas to the center of the screen
    // const dx = window.cvs.$canvas.width*(zoomStep/2)
    // const dy = window.cvs.$canvas.height*(zoomStep/2)
    // window.graph.canvasDragOffset.x += dx
    // window.graph.canvasDragOffset.y += dy

    // window.ctx.translate(dx, dy)
}

export function getZoomOffset(){
    const ref = {x: 0, y: 0}
    const dragOffset = window.graph.canvasDragOffset
    const diff = {x: ref.x - dragOffset.x, y: ref.y - dragOffset.y}

    const width = window.cvs.$canvas.width
    const height = window.cvs.$canvas.height
    const zoom = window.graph.zoom
    const step = constants.ZOOM_FACTOR-1
    return {
        left: diff.x*zoom,
        right: width - width/zoom,
    }
}

export function getViewBox(){
    const {x, y} = window.graph.canvasDragOffset
    const {width, height} = window.cvs.$canvas
    return {
        x: -x,
        y: -y,
        width: width/window.graph.zoom,
        height: height/window.graph.zoom
    }
}