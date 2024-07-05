import constants from "../utils/constants"
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
 * @property {string} borderColor - The border color of the node
 * @property {number} borderWidth - The border width of the node
 * @property {number} fontSize - The font size of the label
 * @property {string} bubble - The bubble attached to the node (String)
 * @property {string} selectedColor - The color of the node when selected (Inherited from Element class)
 * @property {string} hoverColor - The color of the node when hover (Inherited from Element class)
 * @property {number} opacity - The opacity of the node (Inherited from Element class)
 * @property {boolean} selected - Whether the node is selected (Inherited from Element class)
 * @property {boolean} hidden - Whether the node is hidden (Inherited from Element class)
 * @property {string} id - The id of the node (Inherited from Element class)
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
    constructor(x, y, label = null, r = constants.NODE_RADIUS) {
        // If the first argument is an object, copy the properties (clone constructor)
        if (x instanceof Object) {
            super()
            this.copyFrom(x)
            return
        }

        super(label)

        // Data properties
        this._x = x
        this._y = y
        this.r = r
        this.label = label ?? this.id

        // Style properties
        this.backgroundColor = constants.NODE_BACKGROUND_COLOR
        this.labelColor = constants.NODE_LABEL_COLOR
        this.borderColor = constants.NODE_BORDER_COLOR
        this.borderWidth = constants.NODE_BORDER_WIDTH
        this.fontSize = constants.NODE_LABEL_FONT_SIZE

        // Bubble attached to the node
        this.bubble = null

        // Auxiliar properties
        this.offsetPos = {x: 0, y: 0}  // A displacement of the original position
    }

    generateId() {
        const className = this.constructor.name
        const category = `${className.toLowerCase()}s`  // e.g. `Node` -> `nodes`, `Edge` -> `edges`
        let index = window.graph[category].length+1

        // Max id
        window.graph[category].forEach(n => {
            const nodeId = n.id.match(/Node(\d)+/)
            if (nodeId) {
                const i = parseInt(nodeId[1])
                if (i >= index) index = i+1
            }
        })

        return `${className}${index}`
    }

    /**
     * Draw the node
     */
    draw() {
        if (this.hidden) return

        const ctx = window.ctx
        ctx.save()

        ctx.globalAlpha = this.opacity

        // Draw the node as a circle
        ctx.fillStyle = this.backgroundColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fill()
        // Draw the border inside the circle
        if (this.borderWidth > 0 && this.borderColor !== null) {
            ctx.strokeStyle = this.borderColor
            ctx.lineWidth = this.borderWidth
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r - this.borderWidth / 2, 0, Math.PI * 2)
            ctx.stroke()
        }

        // Draw the label
        ctx.fillStyle = this.labelColor
        ctx.textAlign = 'center'
        ctx.font = `bold ${this.fontSize}px Arial`
        const posY = this.y + this.fontSize / 3
        ctx.fillText(this.label, this.x, posY)

        // Draw the selected border
        if (this.selected || this.isHover()) {
            ctx.strokeStyle = this.selected ? this.selectedColor : this.hoverColor
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r + 2, 0, Math.PI * 2)
            ctx.stroke()
        }

        // Draw the bubble
        if (this.bubble !== null) {
            const d = Math.sin(Math.PI / 4) * this.r
            const x = this.x + d
            const y = this.y + d
            ctx.beginPath()
            ctx.fillStyle = constants.NODE_BUBBLE_COLOR
            ctx.arc(x, y, 10, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = constants.NODE_BUBBLE_TEXT_COLOR
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = 'bold 12px Arial'
            ctx.fillText(this.bubble, x , y+1)
        }

        ctx.restore()
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
        // Check if the node is hidden
        if (this.hidden) return false

        // Check if the mouse is hovering the node
        return this.distanceToCenter(window.cvs.x, window.cvs.y) <= this.r
    }

    applyOffset() {
        this.moveBy(this.offsetPos.x, this.offsetPos.y)  
        this.offsetPos = {x: 0, y: 0}
    }

    // ===== Abstract methods =====

    /**
     * Clone the node
     * 
     * @returns Node - The cloned node
     */
    clone() {
        const aux = new Node(this.x, this.y, this.label, this.r)
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
        super.delete()
        window.graph.nodes = window.graph.nodes.filter(n => n !== this)
        window.graph.edges = window.graph.edges.filter(e => e.src !== this && e.dst !== this)
    }


    // ===== Getters and Setters =====
    get x() {
        if (this._x === undefined) return undefined
        return this._x + this.offsetPos.x
    }

    set x(x) {
        this._x = x
    }

    get y() {
        if (this._y === undefined) return undefined
        return this._y + this.offsetPos.y
    }

    set y(y) {
        this._y = y
    }
}