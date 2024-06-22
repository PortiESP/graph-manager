import { Element } from "./element";

export class Info extends Element {
    constructor(x, y, content) {
        super()

        // Data properties
        this.x = x
        this.y = y
        this.content = content

        // Dimensions
        this.fontSize = 12
        this.width, this.height = undefined
        this.x1, this.y1 = undefined
        this.x2, this.y2 = undefined
        this.computeDimensions()

        // Style properties
        this.color = 'black'
        this.borderColor = 'black'
        this.selectedColor = 'aquamarine'
    }


    /**
     * Compute the dimensions of the node based on its content and font size
     * 
     * Updates the following properties:
     * - width
     * - height
     * - x1
     * - y1
     * - x2
     * - y2
     */
    computeDimensions() {
        this.width = this.content.length * this.fontSize / 1.8
        this.height = this.fontSize * 2
        this.x1 = this.x - this.width / 2
        this.y1 = this.y - this.height / 2
        this.x2 = this.x + this.width / 2
        this.y2 = this.y + this.height / 2
    }

    /**
     * Draw the info element on the canvas
     */
    draw() {
        const ctx = window.ctx
        ctx.save() // Save the current context state

        // Return if the content is empty
        if (!this.content) return

        // Determine the style
        const color = this.selected ? this.selectedColor : this.color
        const strokeColor = this.selected ? this.selectedColor : this.borderColor

        // Draw the text
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `bold ${this.fontSize}px Arial`
        ctx.fillText(this.content, this.x, this.y)

        // Draw the border
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 1
        ctx.strokeRect(this.x1, this.y1, this.width, this.height)

        ctx.restore() // Restore the context to its original state
    }


    /**
     * Move the node by dx, dy
     * 
     * @param {number} dx - The number of coordinates to move in the x axis
     * @param {number} dy - The number of coordinates to move in the y axis
     */
    moveBy(dx, dy) {
        // Call the parent method to move the element
        super.moveBy(dx, dy)
        // Update the dimensions
        this.computeDimensions()
    }

    // --- Abstract methods ---
    distance(x, y) {
        const closestX = Math.max(this.x1, Math.min(x, this.x2))
        const closestY = Math.max(this.y1, Math.min(y, this.y2))
        return Math.sqrt((closestX - x) ** 2 + (closestY - y) ** 2)
    }

    isHover() {
        const { x, y } = window.cvs
        return x > this.x1 && x < this.x2 && y > this.y1 && y < this.y2
    }

    clone() {
        return new Info(this.x, this.y, this.content)
    }

    equals(other) {
        return this.content === other.content
    }

    delete() {
        window.graph.info = window.graph.info.filter(e => e !== this)
    }

}