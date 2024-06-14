export class Element {
    constructor(){
        this.selected = false
        // Random id
        this.id = Math.random().toString(36).slice(2)
    }

    // Select the node
    select() {
        if (this.selected) return  // If the node is already selected, return

        this.selected = !this.selected
        window.graph.selected.push(this)
    }

    // Deselect the node
    deselect() {
        if (!this.selected) return  // If the node is not selected, return

        this.selected = false
        window.graph.selected = window.graph.selected.filter(e => e !== this)
    }

    // Toggle the selection state
    toggleSelect() {
        if (this.selected) this.deselect()
        else this.select()
    }

    // Distance (abstract method)
    distance(x, y) {
        throw new Error('Method not implemented.')
    }

    // IsHover (abstract method)
    isHover() {
        throw new Error('Method not implemented.')
    }
}