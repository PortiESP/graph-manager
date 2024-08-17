import { toposortKahn } from "./toposort"

// graph = {Node: [Edge, ...], ...}
export function pertCtm(graph) {

    // Check: Look for a cycle in the graph
    if (toposortKahn(graph).hasCycle) return {error: true, message: "The graph has a cycle"}

    // Start the PERT algorithm
    const nodesData = {}
    // Initialize nodesData
    const defaultPredecessors = {}
    Object.entries(graph).forEach(([node, edges]) => {
        nodesData[node] = {
            earlyStart: null,
            lateStart: Infinity,
            earlyFinish: null,
            lateFinish: Infinity,
            edges: edges,
            visited: false,
            predecessors: defaultPredecessors[node] || [],
            successors: [],
            duration: null,
            float: null,
            freeFloat: null,
            critical: false
        }

        edges.forEach(edge => {
            nodesData[node].successors.push(edge.dst)
            if (nodesData[edge.dst]) nodesData[edge.dst].predecessors.push(node)
            else defaultPredecessors[edge.dst] = [...(defaultPredecessors[edge.dst] || []), node]
            nodesData[node].duration = edge.weight
        })
    })

    // Check: Look make sure that all edges have coming from the same node have the same weight
    for (const node in nodesData) {
        const data = nodesData[node]
        if (data.edges.some(edge => edge.weight !== data.duration)) return {error: true, message: `All edges coming from the same node must have the same weight, check edges from node "${node}"`}
    }

    // Find the starting node
    const startNodes = []
    const endNodes = []
    Object.entries(nodesData).forEach(([node, data]) => {
        if (data.predecessors.length === 0) startNodes.push(node)
        if (data.successors.length === 0) endNodes.push(node)
    })

    // Fill the earlyStart and earlyFinish
    const queue = []
    startNodes.forEach(node => {
        queue.push(node)
        nodesData[node].visited = true
        nodesData[node].earlyStart = 0
        nodesData[node].earlyFinish = nodesData[node].duration
    })
    while (queue.length > 0) {
        const node = queue.shift()
        const data = nodesData[node]
        data.successors.forEach(successor => {
            const successorData = nodesData[successor]
            successorData.earlyStart = Math.max(data.earlyFinish, successorData.earlyStart)
            successorData.earlyFinish = successorData.earlyStart + successorData.duration
            if (successorData.predecessors.every(predecessor => nodesData[predecessor].visited)) {
                queue.push(successor)
                successorData.visited = true
            }
        })
    }

    // Fill the lateStart and lateFinish
    endNodes.forEach(node => {
        queue.push(node)
        nodesData[node].lateStart = nodesData[node].earlyStart
        nodesData[node].lateFinish = nodesData[node].earlyFinish
        nodesData[node].fleeFloat = 0
    })
    while (queue.length > 0) {
        const node = queue.shift()
        const data = nodesData[node]
        data.predecessors.forEach(predecessor => {
            const predecessorData = nodesData[predecessor]
            if (predecessorData.successors.every(successor => nodesData[successor].visited)) {
                queue.push(predecessor)
                predecessorData.lateFinish = Math.min(data.lateStart, predecessorData.lateFinish)
                predecessorData.lateStart = predecessorData.lateFinish - predecessorData.duration
            }
        })
    }

    // Fill the float
    for (let data of Object.values(nodesData)) {
        data.float = data.lateStart - data.earlyStart
        data.freeFloat = data.successors.reduce((acc, successor) => {
            return Math.min(acc, nodesData[successor].earlyStart - data.earlyFinish)
        }, Infinity)
        if (data.freeFloat === Infinity) data.freeFloat = 0
    }

    // Find the critical path
    const criticalPath = []
    for (let node in nodesData) {
        const data = nodesData[node]
        if (data.float === 0) {
            data.critical = true
            criticalPath.push(node)
        }
    }

    return {nodesData, criticalPath, startNodes, endNodes}
}