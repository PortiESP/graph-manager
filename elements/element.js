/**
 * Element class
 * 
 * Represents a generic element in the graph. ⚠️ This class is abstract and should not be instantiated directly.
 * 
 * This class defines the common properties and methods for elements in the graph
 * 
 * **Properties**
 * 
 * ---
 * 
 * @property {string} id - The id of the element. This is a random string generated when the element is created. This id is used to identify the element in the graph, quite useful when elements referencing other elements to keep track of them even if they are cloned.
 * @property {boolean} selected - Whether the element is selected or not
 * 
 * **Methods**
 * 
 * ---
 * 
 * @method select - Activates the selection state of the element and add it to the selected elements array in the graph
 * @method deselect - Deactivates the selection state of the element and remove it from the selected elements array in the graph
 * @method toggleSelect - Toggles the selection state of the element
 * @method distance - Abstract method. Calculates the distance between the element and the point (x, y)
 * @method isHover - Abstract method. Checks if the element is hover
 * @method clone - Abstract method. Clones the element
 * @method equals - Abstract method. Checks if the element is equal to another element
 * @method delete - Abstract method. Deletes the element
 */
export class Element {
    constructor(){
        // Random id
        this.id = Math.random().toString(36).slice(2)
        this.selected = false
    }

    /**
     * Activates the selection state of the element and add it to the selected elements array in the graph
     */
    select() {
        if (this.selected) return  // If the node is already selected, return

        this.selected = !this.selected
        window.graph.selected.push(this)
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

    // ======================================================= Abstract methods =======================================================
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
        throw new Error('Method not implemented.')
    }
}