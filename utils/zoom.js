import constants from "./constants"
import { resetDrag } from "./dragging"

export function resetZoom(){
    // window.ctx.scale(1/window.graph.zoom, 1/window.graph.zoom)
    window.ctx.restore()
    window.graph.canvasDragOffset = {x: 0, y: 0}
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
    const {x, y} = getViewBox()
    const centerX = x + window.cvs.$canvas.width/2
    const centerY = y + window.cvs.$canvas.height/2
    const dx =  centerX
    const dy =  centerY

    window.ctx.translate(x, y)
    window.ctx.scale(zoomFactor, zoomFactor)
    window.ctx.translate(-x, -y)
    window.ctx.translate(dx,dy)

    window.graph.canvasDragOffset.x += dx
    window.graph.canvasDragOffset.y += dy
    
    window.graph.zoom = newZoom
}

export function zoomIn(){
    const {x, y} = window.cvs
    zoomCenter(true)
}

export function zoomOut(){
    const {x, y} = window.cvs
    zoomCenter(false)
}