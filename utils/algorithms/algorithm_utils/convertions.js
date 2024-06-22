export function generateLevelsByPredecessors(predecessors) {
    const levels = Object.fromEntries(Object.keys(predecessors).map(node => [node, undefined]))
    let maxLevel = 0

    const queue = Object.keys(predecessors)
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()

        // If the node has no predecessors, it is a root
        if (predecessors[node] === null) {
            levels[node] = 0
            continue
        }
        
        // Get the predecessor of the node
        const pre = predecessors[node]
        // If the predecessor has no level, it means that it has not been processed yet, so we add the node to the end of the queue
        if (levels[pre] === undefined) {
            queue.push(node)
            continue
        }

        // Update the level of the node
        const level = levels[pre] + 1
        levels[node] = level
    }

    return { levels, maxLevel }
}

export function generateSuccessorsByPredecessors(predecessors) {
    const successors = Object.fromEntries(Object.keys(predecessors).map(node => [node, []]))

    for (const node in predecessors) {
        const pre = predecessors[node]
        if (pre === null) continue

        successors[pre].push(node)
    }

    return successors
}

export function generateBranchesBySuccessors(successors) {
    const branches = Object.fromEntries(Object.keys(successors).map(node => [node, []]))

    for (const node in successors) {
        const suc = successors[node]
        for (const s of suc) {
            branches[s].push(node)
        }
    }
}

export function generateBranchesByPredecessors(predecessors) {
    const branches = Object.fromEntries(Object.keys(predecessors).map(node => [node, []]))

    for (const node in predecessors) {
        const pre = predecessors[node]
        if (pre === null) continue

        branches[pre].push(node)
    }

    return branches
}