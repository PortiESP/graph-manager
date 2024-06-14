import { Element } from "./element"

export class Edge extends Element{
    constructor(src, dst, weight = 1, directed = false) {
        super()

        this.src = src
        this.dst = dst
        this.weight = weight
        this.directed = directed

        this.points = [] // Points that define the edge (src and dst not included)

        this.color = "#888"
        this.hover = false
        this.thickness = 4
    }

    draw() {
        const rSrc = this.src.r
        const rDst = this.dst.r
        const arrowSize = 15

        // Calculate the angle between the two nodes
        const angle = Math.atan2(this.dst.y - this.src.y, this.dst.x - this.src.x)

        // Calculate the offset from the center of the node
        const arrowOffset = this.directed ? arrowSize*0.8 : 0
        const offsetSrc = { x: rSrc * Math.cos(angle), y: rSrc * Math.sin(angle) }
        const offsetDstArrow = { x: rDst * Math.cos(angle + Math.PI), y: rDst * Math.sin(angle + Math.PI) }
        const offsetDst = { x: (rDst + arrowOffset) * Math.cos(angle + Math.PI), y: (rDst + arrowOffset) * Math.sin(angle + Math.PI) }  // Flip the angle by adding PI


        // Draw the edge
        window.ctx.beginPath()
        window.ctx.strokeStyle = 
            this.selected ? 'aquamarine' : 
            this.isHover() ? '#aaa' : 
            this.color
        window.ctx.lineWidth = this.thickness
        window.ctx.moveTo(this.src.x + offsetSrc.x, this.src.y + offsetSrc.y)
        if (this.points.length > 0) {
            this.points.forEach(p => {
                window.ctx.lineTo(p.x, p.y)
            })
        }
        window.ctx.lineTo(this.dst.x + offsetDst.x, this.dst.y + offsetDst.y)
        window.ctx.stroke()

        // If the edge is directed, draw an arrow
        if (this.directed) {
            const arrowAngle = Math.PI / 6

            window.ctx.beginPath()
            window.ctx.fillStyle = this.isHover() ? "red" : this.color
            window.ctx.moveTo(this.dst.x + offsetDstArrow.x, this.dst.y + offsetDstArrow.y)
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle - arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle - arrowAngle))
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle + arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle + arrowAngle))
            window.ctx.fill()
        }

        // Draw the weight
        if (window.graph.showWeights) {
            const centerX = (this.src.x + this.dst.x) / 2
            const centerY = (this.src.y + this.dst.y) / 2
            
            window.ctx.font = "16px Arial"   
            window.ctx.textAlign = "center"
            window.ctx.textBaseline = "middle"
            window.ctx.fillStyle = "#bbb8"
            window.ctx.fillRect(centerX - 15, centerY - 16*0.75, 30, 20)
            window.ctx.fillStyle = "#000"
            window.ctx.fillText(this.weight, centerX, centerY)
        }
            
    }

    distance(x, y) {
        // Calculate the distance from the edge to the point
        const A = this.src.y - this.dst.y // y1 - y2
        const B = this.dst.x - this.src.x // x2 - x1
        const C = this.src.x * this.dst.y - this.dst.x * this.src.y // x1*y2 - x2*y1

        const dist = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)

        // Check if the point is inside the edge

        return dist
    }

    isHover() {
        const x = window.cvs.x
        const y = window.cvs.y

        const x1 = Math.min(this.src.x, this.dst.x)
        const x2 = Math.max(this.src.x, this.dst.x)
        const y1 = Math.min(this.src.y, this.dst.y)
        const y2 = Math.max(this.src.y, this.dst.y)

        // Check if the point is outside the bounding box of the edge
        if (x < x1 || x > x2 || y < y1 || y > y2) return false

        // If the point is hovering any of the nodes, return false
        if (this.src.isHover() || this.dst.isHover()) return false

        return this.distance(window.cvs.x, window.cvs.y) <= this.thickness  
    }

    // This method does nothing for edges
    moveBy(){}
}