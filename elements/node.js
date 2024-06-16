import { Element } from "./element"

/**
 * Node class
 * 
 * @property {number} x - The x coordinate of the node
 * @property {number} y - The y coordinate of the node
 * @property {number} r - The radius of the node
 * @property {string} label - The label of the node
 * @property {string} background - The background color of the node
 * @property {string} color - The color of the label
 * 
 * @method draw - Draw the node
 * @method contains - Check if the node contains the point (x, y)
 * @method moveBy - Move the node by dx, dy
 * @method distanceToCenter - Distance to center
 * @method distance - Distance to another any side (Inherited from Element class)
 * @method isHover - Check if the node is hover (Inherited from Element class)
 * @method clone - Clone (Inherited from Element class)
 * @method equals - Equals (Inherited from Element class)
 * @method delete - Delete the node (Inherited from Element class)
 * 
 */
export class Node extends Element{
    constructor(x, y, r, label = null) {
        super()

        // Data properties
        this.x = x
        this.y = y
        this.r = r
        this.label = label || this.id

        // Style properties
        this.backgroundColor = 'black'
        this.labelColor = 'white'
        this.borderColor = null
        this.borderWidth = 0
        this.hoverColor = 'gray'
        this.selectedColor = 'aquamarine'
        this.fontSize = 20
    }

    /**
     * Draw the node
     */
    draw() {
        const ctx = window.ctx

        // Draw the node as a circle
        ctx.fillStyle = 
            this.selected ? this.selectedColor : 
            this.isHover() ? this.hoverColor : 
            this.backgroundColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        // Draw the border
        if (this.borderColor) {
            ctx.strokeStyle = this.borderColor
            ctx.lineWidth = this.borderWidth
            ctx.stroke()
        }

        // Draw the label
        if (this.label) {
            ctx.fillStyle = this.labelColor
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = 'bold ' + this.fontSize + 'px Arial'
            ctx.fillText(this.label, this.x, this.y)
        }
    }

    /**
     * Check if the node contains the point (x, y)
     * 
     * @param {number} x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     * 
     * @returns boolean - Whether the node contains the point (x, y)
     */
    contains(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return dx * dx + dy * dy < this.r * this.r
    }

    /**
     * Move the node by dx, dy
     * 
     * @param {number} dx - The number of coordinates to move in the x axis
     * @param {number} dy - The number of coordinates to move in the y axis
     */
    // Move the node by dx, dy
    moveBy(dx, dy) {
        this.x += dx
        this.y += dy
    }



    /**
     * Distance from a point to the center of the node
     * 
     * @param {number} x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     * 
     * @returns number - The distance from the point (x, y) to the center of the node
     */
    distanceToCenter(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    /**
     * Distance from a point to the closest border of the node
     * 
     * @param {number} x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     * 
     * @returns number - The distance from the point (x, y) to the closest border of the node
     */
    distance(x, y) {
        const dx = x - this.x
        const dy = y - this.y
        return Math.abs(Math.sqrt(dx * dx + dy * dy) - this.r)
    }

    /**
     * Check if the mouse is hovering the node
     * 
     * @returns boolean - Whether the mouse is hovering the node
     */
    isHover() {
        return this.distanceToCenter(window.cvs.x, window.cvs.y) <= this.r
    }

    /**
     * Clone the node
     * 
     * @returns Node - The cloned node
     */
    clone() {
        const aux = new Node(this.x, this.y, this.r, this.label)
        aux.backgroundColor = this.backgroundColor
        aux.labelColor = this.labelColor
        aux.borderColor = this.borderColor
        aux.borderWidth = this.borderWidth
        aux.hoverColor = this.hoverColor
        aux.selectedColor = this.selectedColor
        aux.fontSize = this.fontSize
        aux.id = this.id
        aux.selected = this.selected
        
        return aux
    }

    /**
     * Check if the node is equal to another node. Two nodes are equal if their x, y, r and label are equal
     * 
     * @param {Node} node - The node to compare
     * @returns boolean - Whether the node is equal to the other node
     */
    equals(node) {
        return [
            this.x === node.x,
            this.y === node.y,
            this.r === node.r,
            this.label === node.label
        ].every(e => e)
    }

    /**
     * Delete the node and its edges
     */
    delete() {
        window.graph.nodes = window.graph.nodes.filter(n => n !== this)
        window.graph.edges = window.graph.edges.filter(e => e.src !== this && e.dst !== this)
    }
}