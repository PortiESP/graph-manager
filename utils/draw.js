export default function drawAll(){
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