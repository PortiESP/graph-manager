import constants from "./constants"

export function resetZoom(){
    window.ctx.scale(1/window.graph.zoom, 1/window.graph.zoom)
    // window.graph.canvasDragOffset = {x: 0, y: 0}
    window.graph.zoom = 1
}

export function getViewBox(){
    const {x, y} = window.graph.canvasDragOffset
    const {width, height} = window.cvs.$canvas
    return {
        x: -x,
        y: -y,
        width: width/window.graph.zoom,
        height: height/window.graph.zoom,
        x2: -x + width/window.graph.zoom,
        y2: -y + height/window.graph.zoom
    }
}

export function zoomCenter(zoomIn){
    const zoomFactor = zoomIn ? 1.1 : 0.9
    const newZoom = zoomIn ? window.graph.zoom * zoomFactor : window.graph.zoom * zoomFactor
    const {x, y, width, height} = getViewBox()
    const centerX = x + window.cvs.$canvas.width/2
    const centerY = y + window.cvs.$canvas.height/2
    const userX = window.cvs.x
    const userY = window.cvs.y
    const dx = -(width*zoomFactor - width)/2
    const dy = -(width*zoomFactor - width)/2

    window.ctx.translate(x, y)
    window.ctx.scale(zoomFactor, zoomFactor)
    window.ctx.translate(-x, -y)
    window.ctx.translate(dx,dy)

    window.graph.canvasDragOffset.x += dx
    window.graph.canvasDragOffset.y += dy
    
    window.graph.zoom = newZoom

    // Update mouse position
    window.cvs.x = userX-dx
    window.cvs.y = userY-dy
}

export function zoomIn(){
    const {x, y} = window.cvs
    zoomCenter(true)
}

export function zoomOut(){
    const {x, y} = window.cvs
    zoomCenter(false)
}