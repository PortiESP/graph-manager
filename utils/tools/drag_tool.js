export default {
    setup(){
        document.body.style.cursor = "grab"
    },
    mouseDownCallback(button, coords){
        document.body.style.cursor = "grabbing"
    },
    mouseUpCallback(button, coords){
        document.body.style.cursor = "grab"
    },
    mouseMoveCallback(e, coords){
        // Do something
    },
    clean(){
        document.body.style.cursor = "default"
    }
}