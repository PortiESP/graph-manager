/**
 * Generates a snapshot of the current graph state and stores it in the memento array.
 */
export function recordMemento() {
    if (window.graph.enableMemento === false) return

    // Check if the the snapshot is prevented from being recorded (used when we want to avoid recording the snapshot in some specific cases when in regular cases it should be recorded)
    if (window.graph.preventMemento) {
        window.graph.preventMemento = false
        return
    }

    // Generate the snapshot (a copy of the current graph state)
    const snapshot = generateSnapshot()

    // Check if the snapshot is equal to the last snapshot in the memento array (to avoid storing the same state multiple times)
    if (window.graph.memento.length > 0) {
        const lastSnapshot = window.graph.memento[window.graph.memento.length - 1]
        if (snapshotEquals(snapshot, lastSnapshot)) return
    }

    // Store the snapshot in the memento array
    window.graph.memento.push(snapshot)
    window.graph.mementoRedo = []

    // Debug
    if (window.cvs.debug) console.log("Recording memento: ", snapshot)
}

/**
 * Generates a snapshot of the current graph state. 
 * 
 * A snapshot is a copy of the current graph state, including the nodes, edges, and selected nodes.
 * 
 * @returns {Object} A snapshot of the current graph state.
 */
export function generateSnapshot() {
    const auxNodes = window.graph.nodes.map(node => node.clone())
    const auxEdges = window.graph.edges.map(edge => edge.clone())

    return {
        nodes: auxNodes,
        edges: auxEdges,
        selected: auxNodes.filter(node => node.selected)
    }
}

/**
 * Restores the last snapshot from the memento array. Usually triggered by the keyboard shortcut Ctrl+Z.
 */
export function undo() {
    if (window.graph.enableMemento === false) return
    if (!hasUndo()) return

    // Append the current state to the redo stack in case the user wants to revert the undo
    window.graph.mementoRedo.push(generateSnapshot())
    // Restore the last snapshot
    const snapshot = window.graph.memento.pop()
    restoreSnapshot(snapshot)
}

/**
 * Restores the last snapshot from the redo array. Usually triggered by the keyboard shortcut Ctrl+Y or Ctrl+Shift+Z.
 */
export function redo() {
    if (window.graph.enableMemento === false) return
    if (!hasRedo()) return

    // Append the current state to the undo stack in case the user wants to revert the redo
    window.graph.memento.push(generateSnapshot())
    // Restore the last snapshot
    const snapshot = window.graph.mementoRedo.pop()
    restoreSnapshot(snapshot)
}

export function hasUndo() {
    return window.graph.memento.length > 0
}

export function hasRedo() {
    return window.graph.mementoRedo.length > 0
}

/**
 * Restores the graph state from a snapshot.
 * 
 * @param {Object} snapshot - A snapshot of the graph state.
 */
// Restores the graph state from a snapshot
export function restoreSnapshot(snapshot) {
    window.graph.nodes = snapshot.nodes
    window.graph.edges = snapshot.edges
    window.graph.selected = snapshot.selected

    // Fix the references of the edges
    window.graph.edges.forEach(edge => {
        edge.src = window.graph.nodes.find(node => node.id === edge.src.id)
        edge.dst = window.graph.nodes.find(node => node.id === edge.dst.id)
    })
}

/**
 * Compares two snapshots. 
 * 
 * Two snapshots are equal if:
 * - They have the same elements, in the same order.
 * 
 * The elements are evaluated by the equals method that should be implemented in the elements classes.
 * 
 * @param {Object} snapshot1 - The first snapshot.
 * @param {Object} snapshot2 - The second snapshot.
 * @returns {boolean} Whether the two snapshots are equal.
 */
export function snapshotEquals(snapshot1, snapshot2) {
    // Fast check: compare the length of the nodes and edges arrays
    if (snapshot1.nodes.length !== snapshot2.nodes.length) return false
    if (snapshot1.edges.length !== snapshot2.edges.length) return false
    if (snapshot1.selected.length !== snapshot2.selected.length) return false

    // Slow check: compare each node and edge
    // Compare the nodes
    for (let i = 0; i < snapshot1.nodes.length; i++) {
        if (!snapshot1.nodes[i].equals(snapshot2.nodes[i])) return false
    }
    // Compare the edges
    for (let i = 0; i < snapshot1.edges.length; i++) {
        if (!snapshot1.edges[i].equals(snapshot2.edges[i])) return false
    }
    // Compare the selected elements
    for (let i = 0; i < snapshot1.selected.length; i++) {
        if (snapshot1.selected[i].id !== snapshot2.selected[i].id) return false
    }

    return true
}

/**
 * Discards the last snapshot from the memento array. Usually triggered when the user clicks on an empty space to deselect all nodes.
 */
export function discardLastSnapshot() {
    if (window.graph.enableMemento === false) return
    
    window.graph.memento.pop()
}