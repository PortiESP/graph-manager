export default function drawAll(){
    drawGrid()

    // --- Edges ---
    // Draw edges
    window.graph.edges.forEach(e => {
        e.draw()
    })

    // Draw new edge
    if (window.graph.newEdgeScr) {
        window.ctx.beginPath()
        window.ctx.moveTo(window.graph.newEdgeScr.x, window.graph.newEdgeScr.y)
        window.ctx.lineTo(window.cvs.x, window.cvs.y)
        window.ctx.stroke()
    }

    // --- Nodes ---
    // Draw nodes
    window.graph.nodes.forEach(e => {
        e.draw()
    })

    // Draw new node
    if (window.graph.newNode) {
        window.ctx.fillStyle = 'black'
        window.ctx.beginPath()
        window.ctx.arc(window.cvs.x, window.cvs.y, 30, 0, Math.PI * 2)
        window.ctx.fill()
    }
}


export function drawGrid(){
    const ctx = window.ctx
    const cvs = window.cvs

    const gridSize = 50
    const gridColor = "#ddd"
    const gridThickness = 1

    // Draw the grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = gridThickness
    const width = cvs.$canvas.width
    const height = cvs.$canvas.height
    const offsetX = cvs.canvasDragOffset.x
    const offsetY = cvs.canvasDragOffset.y
    const iniX = -(2*gridSize) - Math.floor(offsetX / gridSize) * gridSize
    const iniY = -(2*gridSize) - Math.floor(offsetY / gridSize) * gridSize
    const finX = (2*gridSize) + width - Math.floor(offsetX / gridSize) * gridSize
    const finY = (2*gridSize) + height - Math.floor(offsetY / gridSize) * gridSize
    for (let x = iniX; x < finX; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, iniY)
        ctx.lineTo(x, finY)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(x, x+10, -offsetY+10)
    }
    for (let y = iniY; y < finY; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(iniX, y)
        ctx.lineTo(finX, y)
        ctx.stroke()
        ctx.fillStyle = gridColor
        ctx.fillText(y, -offsetX+4, y+20)
    }
}