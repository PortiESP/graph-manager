import constants from "../utils/constants"
import { Element } from "./element"

/**
 * Node class
 * 
 * This class represents a node in the graph
 * 
 * **Constructor**
 * 
 * ---
 * 
 * @param {number} x - The x coordinate of the node
 * @param {number} y - The y coordinate of the node
 * @param {string} label - The label of the node
 * @param {number} r - The radius of the node
 * 
 * **Properties**
 * 
 * ---
 * 
 * @property {number} x - The x coordinate of the node
 * @property {number} y - The y coordinate of the node
 * @property {number} r - The radius of the node
 * @property {string} label - The label of the node
 * @property {string} backgroundColor - The background color of the node
 * @property {string} color - The color of the label
 * @property {string} borderColor - The border color of the node
 * @property {number} borderRatio - The border width of the node (Ratio of the radius)
 * @property {number} fontSize - The font size of the label
 * @property {string} bubble - The bubble attached to the node (String)
 * @property {string} bubbleColor - The color of the bubble
 * @property {string} bubbleTextColor - The color of the bubble text
 * @property {number} bubbleTextSize - The font size of the bubble text
 * @property {number} bubbleRadius - The radius of the bubble
 * @property {string} selectedColor - The color of the node when selected (Inherited from Element class)
 * @property {string} hoverColor - The color of the node when hover (Inherited from Element class)
 * @property {number} opacity - The opacity of the node (Inherited from Element class)
 * @property {boolean} selected - Whether the node is selected (Inherited from Element class)
 * @property {boolean} hidden - Whether the node is hidden (Inherited from Element class)
 * @property {string} id - The id of the node (Inherited from Element class)
 * 
 * 
 * **Methods**
 * 
 * ---
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
export class Node extends Element {
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
        this._r = r
        this._label = label ?? this.id

        // Default style properties
        this._backgroundColor = constants.NODE_BACKGROUND_COLOR
        this._labelColor = constants.NODE_LABEL_COLOR
        this._borderColor = constants.NODE_BORDER_COLOR
        this._borderRatio = constants.NODE_BORDER_RATIO
        this._fontSize = constants.NODE_LABEL_FONT_SIZE
        this._bubbleColor = constants.NODE_BUBBLE_COLOR
        this._bubbleTextColor = constants.NODE_BUBBLE_TEXT_COLOR
        this._bubbleTextSize = constants.NODE_BUBBLE_TEXT_SIZE
        this._bubbleRadius = constants.NODE_BUBBLE_RADIUS


        // Bubble attached to the node
        this._bubble = null

        // Auxiliar properties
        this._offsetPos = { x: 0, y: 0 }  // A displacement of the original position

        // Initialize the style (after all the properties have been set)
        this.resetStyle()
    }

    // This method is used to copy the properties of the node into an object where those properties can be modified without affecting the original node (used for displaying temporarly the node with a different style)
    // Any property that is not included in this method must be accessed directly from the node's original properties
    resetStyle() {
        super.resetStyle()
        this.style.backgroundColor = this.backgroundColor
        this.style.labelColor = this.labelColor
        this.style.borderColor = this.borderColor
        this.style.borderRatio = this.borderRatio
        this.style.fontSize = this.fontSize
        this.style.bubbleColor = this.bubbleColor
        this.style.bubbleTextColor = this.bubbleTextColor
        this.style.bubbleTextSize = this.bubbleTextSize
        this.style.bubbleRadius = this.bubbleRadius

        // Computed
        this.computeStyle()
    }

    // Update the style properties
    computeStyle() {
        this.style.borderSize = this.r * this.style.borderRatio
    }

    generateId() {
        const className = this.constructor.name
        const category = `${className.toLowerCase()}s`  // e.g. `Node` -> `nodes`, `Edge` -> `edges`
        let index = window.graph[category].length + 1

        // Max id
        window.graph[category].forEach(n => {
            const nodeId = n.id.match(/Node(\d)+/)
            if (nodeId) {
                const i = parseInt(nodeId[1])
                if (i >= index) index = i + 1
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

        const style = this.style

        ctx.globalAlpha = style.opacity

        // Draw the node as a circle
        ctx.fillStyle = style.backgroundColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, Math.max(0, this.r), 0, Math.PI * 2)
        ctx.fill()

        // Draw the border inside the circle
        if (style.borderRatio > 0 && style.borderColor !== null) {
            ctx.strokeStyle = style.borderColor
            ctx.lineWidth = style.borderSize
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r - style.borderSize / 2, 0, Math.PI * 2)
            ctx.stroke()
        }


        // Draw the label
        ctx.fillStyle = style.labelColor
        ctx.textAlign = 'center'
        ctx.font = `bold ${style.fontSize}px Arial`
        const posY = this.y + style.fontSize / 3
        ctx.fillText(this.label, this.x, posY)

        // Draw the selected border
        if (this.selected || this.isHover()) {
            const color = this.selected ? style.selectedColor
                : window.graph.tool === "delete" ? style.deleteColor
                    : style.hoverColor
            ctx.strokeStyle = color
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
            ctx.fillStyle = style.bubbleColor
            ctx.arc(x, y, style.bubbleRadius, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = style.bubbleTextColor
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = `bold ${style.bubbleTextSize}px Arial`
            ctx.fillText(this.bubble, x, y + 1)
        }

        if (window.cvs.debug) {
            // Type
            ctx.fillStyle = "blue"
            ctx.font = "7px Arial"
            ctx.textAlign = "center"
            ctx.fillText(this.id, this.x, this.y + this.r + 8)
            ctx.fillText(this.distance(window.cvs.x, window.cvs.y).toFixed(2), this.x, this.y + this.r + 16)
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
        return Math.sqrt(dx * dx + dy * dy) - this.r
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
        this.offsetPos = { x: 0, y: 0 }
    }

    // ===== Abstract methods =====

    /**
     * Clone the node
     * 
     * @returns Node - The cloned node
     */
    clone() {
        window.graph.disableListeners = true // Temporarily disable listeners

        // Clone the node
        const aux = new Node(this.x, this.y, this.label, this.r)
        // Copy all the properties
        Object.assign(aux, this)

        window.graph.disableListeners = false // Enable listeners again
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
        window.graph.edges = window.graph.edges.filter(e => e.src !== this && e.dst !== this)
        window.graph.nodes = window.graph.nodes.filter(n => n !== this)
        super.delete()
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

    get r() {
        return this._r
    }

    set r(r) {
        this._r = r

        // Compute the style
        this.computeStyle()
    }

    get label() {
        return this._label
    }

    set label(label) {
        this._label = label
    }

    get backgroundColor() {
        return this._backgroundColor
    }

    set backgroundColor(backgroundColor) {
        this._backgroundColor = backgroundColor
    }

    get labelColor() {
        return this._labelColor
    }

    set labelColor(labelColor) {
        this._labelColor = labelColor
    }

    get labelColor() {
        return this._labelColor
    }

    set labelColor(labelColor) {
        this._labelColor = labelColor
    }

    get borderColor() {
        return this._borderColor
    }

    set borderColor(borderColor) {
        this._borderColor = borderColor
    }

    get borderRatio() {
        return this._borderRatio
    }

    set borderRatio(borderRatio) {
        this._borderRatio = borderRatio

        // Compute the style
        this.computeStyle()
    }

    get fontSize() {
        return this._fontSize
    }

    set fontSize(fontSize) {
        this._fontSize = fontSize
    }

    get bubble() {
        return this._bubble
    }

    set bubble(bubble) {
        this._bubble = bubble
    }

    get bubbleColor() {
        return this._bubbleColor
    }

    set bubbleColor(bubbleColor) {
        this._bubbleColor = bubbleColor
    }

    get bubbleTextColor() {
        return this._bubbleTextColor
    }

    set bubbleTextColor(bubbleTextColor) {
        this._bubbleTextColor = bubbleTextColor
    }

    get bubbleTextSize() {
        return this._bubbleTextSize
    }

    set bubbleTextSize(bubbleTextSize) {
        this._bubbleTextSize = bubbleTextSize
    }

    get bubbleRadius() {
        return this._bubbleRadius
    }

    set bubbleRadius(bubbleRadius) {
        this._bubbleRadius = bubbleRadius
    }

    get offsetPos() {
        return this._offsetPos
    }

    set offsetPos(offsetPos) {
        this._offsetPos = offsetPos
    }
}