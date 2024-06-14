// Generates a snapshot of the current graph state and stores it in the memento array.
export function recordMemento() {
    const snapshot = generateSnapshot()

    // Check if the snapshot is different from the last one
    if (window.graph.memento.length > 0) {
        const lastSnapshot = window.graph.memento[window.graph.memento.length - 1]
        if (snapshotEquals(snapshot, lastSnapshot)) return
    }

    window.graph.memento.push(snapshot)
    window.graph.mementoRedo = []
}

// Restores the last snapshot from the memento array.
export function undo() {
    if (window.graph.memento.length === 0) return

    // Append the current state to the redo stack in case the user wants to revert the undo
    window.graph.mementoRedo.push(generateSnapshot())
    // Restore the last snapshot
    const snapshot = window.graph.memento.pop()
    restoreSnapshot(snapshot)
}

// Restores the last snapshot from the redo array.
export function redo() {
    if (window.graph.mementoRedo.length === 0) return

    // Append the current state to the undo stack in case the user wants to revert the redo
    window.graph.memento.push(generateSnapshot())
    // Restore the last snapshot
    const snapshot = window.graph.mementoRedo.pop()
    restoreSnapshot(snapshot)
}

// Generates a copy of the current graph state
export function generateSnapshot() {
    return {
        nodes: window.graph.nodes.map(node => node.clone()),
        edges: window.graph.edges.map(edge => edge.clone()),
    }
}

// Restores the graph state from a snapshot
export function restoreSnapshot(snapshot) {
    window.graph.nodes = snapshot.nodes
    window.graph.edges = snapshot.edges

    // Fix the references of the edges
    window.graph.edges.forEach(edge => {
        edge.src = window.graph.nodes.find(node => node.id === edge.src.id)
        edge.dst = window.graph.nodes.find(node => node.id === edge.dst.id)
    })
}

// Compares two snapshots
export function snapshotEquals(snapshot1, snapshot2) {
    if (snapshot1.nodes.length !== snapshot2.nodes.length) return false
    if (snapshot1.edges.length !== snapshot2.edges.length) return false

    for (let i = 0; i < snapshot1.nodes.length; i++) {
        if (!snapshot1.nodes[i].equals(snapshot2.nodes[i])) return false
    }

    for (let i = 0; i < snapshot1.edges.length; i++) {
        if (!snapshot1.edges[i].equals(snapshot2.edges[i])) return false
    }

    return true
}