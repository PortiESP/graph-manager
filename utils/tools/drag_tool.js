import { startDragging, stopDragging } from "../dragging"

export default {
    setup(){
        document.body.style.cursor = "grab"
    },
    mouseDownCallback(button, coords){
        if (button === 0) {
            document.body.style.cursor = "grabbing"
            startDragging("grab")
        }
    },
    mouseUpCallback(button, coords){
        document.body.style.cursor = "grab"
        if (button === 0) {
            stopDragging()
        }
    },
    mouseMoveCallback(e, coords){
        // If the left mouse button is pressed
        const ctx = window.ctx

        if (window.cvs.mouseDown === 0) {
            const {movementX: dx, movementY: dy} = e
            window.cvs.canvasDragOffset = {x: window.cvs.canvasDragOffset.x + dx, y: window.cvs.canvasDragOffset.y + dy}
            ctx.translate(dx, dy)
        }
    },
    keyDownCallback(key){
        if (key === "Escape") {
            stopDragging()
        }
        if (key === "Backspace") {
            window.ctx.translate(-window.cvs.canvasDragOffset.x, -window.cvs.canvasDragOffset.y)
            window.cvs.canvasDragOffset = {x: 0, y: 0}
        }
    },
    clean(){
        document.body.style.cursor = "default"
    }
}