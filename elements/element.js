import constants from "../utils/constants"

/**
 * Element class
 * 
 * Represents a generic element in the graph. ⚠️ This class is abstract and should not be instantiated directly.
 * 
 * This class defines the common properties and methods for elements in the graph
 * 
 * **Params**
 * 
 * @param {string} id - The id of the element. If not provided, a random id will be generated
 * 
 * **Properties**
 * 
 * ---
 * 
 * @property {string} id - The id of the element
 * @property {boolean} selected - The selection state of the element
 * @property {boolean} hidden - The visibility state of the element
 * @property {string} hoverColor - The color of the border when the element is hovered
 * @property {string} selectedColor - The color of the border when the element is selected
 * @property {string} deleteColor - The color of the border when the element is selected for deletion
 * @property {number} opacity - The opacity of the element
 * @property {object} style - The style properties of the element
 * 
 * **Methods**
 * 
 * ---
 * 
 * @method select - Activates the selection state of the element and add it to the selected elements array in the graph
 * @method deselect - Deactivates the selection state of the element and remove it from the selected elements array in the graph
 * @method toggleSelect - Toggles the selection state of the element
 * @method generateId - Generate a random id for the element using the format: `<ClassName>_<randomString>`
 * @method toString - Generate a string representation of the element
 * @method moveBy (dx, dy) - Move the node by dx, dy
 * @method moveToPoint (x, y) - Move the node to the point (x, y)
 * @method copyFrom (element) - Copy the properties of the node to another element
 * @method draw - Draw (abstract method)
 * @method distance (x, y) - Distance (abstract method)
 * @method isHover - IsHover (abstract method)
 * @method clone - Clone (abstract method)
 * @method equals - equals (abstract method)
 * @method delete - Delete (abstract method)
 * @method resetStyle - Reset style (this method is useful both to have a temporary style, and to have a place to have computed properties that are not stored as properties since they are calculated)
 */
export class Element {
    constructor(id){
        // Random id 
        this._id = id ?? this.generateId()

        // States
        this._selected = false
        this._hidden = false

        // Style properties
        this._hoverColor = constants.HOVER_BORDER_COLOR
        this._selectedColor = constants.SELECTED_BORDER_COLOR
        this._deleteColor = constants.DELETE_BORDER_COLOR
        this._opacity = 1

        // Style properties
        this._style = {} // This values will override the default ones just for stetic purposes (not for logic or calculations) (private properties are not included since they are already managed by the getters and setters)
    }


    /**
     * Generate a random id for the element using the format: `<ClassName>_<randomString>`
     * 
     * @returns {string} A random id for the element
     */
    generateId() {
        const className = this.constructor.name
        return `${className}_${Math.random().toString(36).substring(2, 15)}`
    }


    /**
     * Activates the selection state of the element and add it to the selected elements array in the graph
     */
    select() {
        if (this.selected) return  // If the node is already selected, return

        this.selected = true
        window.graph.pushSelected(this)
    }

    /**
     * Deactivates the selection state of the element and remove it from the selected elements array in the graph
     */
    deselect() {
        if (!this.selected) return  // If the node is not selected, return

        this.selected = false
        window.graph.selected = window.graph.selected.filter(e => e !== this)
    }

    /**
     * Toggles the selection state of the element
     */
    toggleSelect() {
        if (this.selected) this.deselect()
        else this.select()
    }


    /**
     * Generate a string representation of the element
     * 
     * @returns {string} A string representation of the element
     */
    toString() {
        return this.id
    }

    /**
     * Move the node by dx, dy
     * 
     * @param {number} dx - The number of coordinates to move in the x axis
     * @param {number} dy - The number of coordinates to move in the y axis
     */
    moveBy(dx, dy) {
        this._x += dx
        this._y += dy
    }


    /**
     * Move the node to the point (x, y)
     * 
     * @param {number} x - The x coordinate of the point
     * @param {number} y - The y coordinate of the point
     */
    moveToPoint(x, y) {
        this.x = x
        this.y = y
    }

    /**
     * Copy the properties of the node to another element
     * 
     * @param {Element} element - The element to copy the properties from
     */
    copyFrom(element) {
        Object.keys(element).forEach(key => this[key] = element[key])
    }

    // ======================================================= Abstract methods =======================================================
    // Draw (abstract method)
    draw() {
        throw new Error('Method not implemented.')
    }

    // Distance (abstract method)
    distance(x, y) {
        throw new Error('Method not implemented.')
    }

    // IsHover (abstract method)
    isHover() {
        throw new Error('Method not implemented.')
    }

    // Clone (abstract method)
    clone() {
        throw new Error('Method not implemented.')
    }

    // equals (abstract method)
    equals() {
        throw new Error('Method not implemented.')
    }

    // Delete (abstract method)
    delete() {
        window.graph.selected = window.graph.selected.filter(e => e !== this)
    }

    // Reset style (this method is useful both to have a temporary style, and to have a place to have computed properties that are not stored as properties since they are calculated)
    resetStyle() {
        this.style = {
            hoverColor: constants.HOVER_BORDER_COLOR,
            selectedColor: constants.SELECTED_BORDER_COLOR,
            deleteColor: constants.DELETE_BORDER_COLOR,
            opacity: 1
        }

    }

    
    // ======================================================= Getters and setters =======================================================

    get id() { return this._id }
    set id(id) { 
        window.ui.call("live-editor-updated-id", this.id, id)
        this._id = id 
        // Listeners
        window.graph.triggerElementListeners()
    }

    get selected() { return this._selected }
    set selected(selected) { this._selected = selected }
    
    get hidden() { return this._hidden }
    set hidden(hidden) { this._hidden = hidden }

    get hoverColor() { return this._hoverColor }
    set hoverColor(hoverColor) { this._hoverColor = hoverColor }

    get selectedColor() { return this._selectedColor }
    set selectedColor(selectedColor) { this._selectedColor = selectedColor }

    get deleteColor() { return this._deleteColor }
    set deleteColor(deleteColor) { this._deleteColor = deleteColor }

    get opacity() { return this._opacity }
    set opacity(opacity) { this._opacity = opacity }

    get style() { return this._style }
    set style(style) { this._style = style }
    
}