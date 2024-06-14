import { Element } from "./element"

export class Node extends Element{
    constructor(x, y, r, label = null) {
        super()

        this.x = x
        this.y = y
        this.r = r
        this.label = label

        this.background = 'black'
        this.color = 'white'
    }

    // Draw the node
    draw() {
        const ctx = window.ctx

        ctx.fillStyle = 
            this.selected ? 'aquamarine' : 
            this.isHover() ? 'gray' : 
            this.background
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()

        // Draw the label
        if (this.label) {
            ctx.fillStyle = this.color
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = 'bold 20px Arial'
            ctx.fillText(this.label, this.x, this.y)
        }
    }

    // Check if the node contains the point (x, y)
    contains(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return dx * dx + dy * dy < this.r * this.r
    }

    // Move the node by dx, dy
    moveBy(dx, dy) {
        this.x += dx
        this.y += dy
    }



    // Distance to center
    distanceToCenter(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    // Distance to another any side
    distance(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return Math.abs(Math.sqrt(dx * dx + dy * dy) - this.r)
    }

    // Is hover
    isHover() {
        return this.distanceToCenter(window.cvs.x, window.cvs.y) <= this.r
    }

    // Clone
    clone() {
        const aux = new Node(this.x, this.y, this.r, this.label)
        aux.background = this.background
        aux.color = this.color
        aux.id = this.id
        aux.selected = this.selected
        
        return aux
    }

    // Equals
    equals(node) {
        return [
            this.x === node.x,
            this.y === node.y,
            this.r === node.r,
            this.label === node.label
        ].every(e => e)
    }
}