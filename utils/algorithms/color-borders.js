/*
    Assign each node to a group not already assigned to a neighbor, using the least amount of groups possible.

    - graph: {Node: [Edge, ...], ...}
*/
export default function colorBorders(graph, start=false) {
    // Assign each node to a group not already assigned to a neighbor, using the least amount of groups possible.
    const groups = Object.fromEntries(Object.keys(graph).map(key => [key, null]))
    
    // If no start node is given, try all nodes as starting nodes
    if (!start) {
        let bestSol = Infinity
        let bestGroups = null

        for (let node in graph) {
            const groupsCopy = Object.assign({}, groups)
            const sol = colorRec(graph, node, groupsCopy)
            const maxGroup = Math.max(...Object.values(sol))
            if (maxGroup < bestSol) {
                bestSol = maxGroup
                bestGroups = sol
            }
        }

        return bestGroups
    }

    // If a start node is given, color the graph starting from that node
    colorRec(graph, start, groups)
    return groups
}

function colorRec(graph, node, groups) {
    // Get the neighbors of the node
    const edges = graph[node]

    // Get the groups of the neighbors
    const neighborGroups = edges.map(neighbor => groups[neighbor.dst])

    // Get the available groups
    const availableGroups = [...Array(Object.keys(groups).length + 1).keys()].filter(group => !neighborGroups.includes(group))

    groups[node] = availableGroups[0]

    // Recur to the neighbors
    edges.forEach(neighbor => {
        if (groups[neighbor.dst] === null) colorRec(graph, neighbor.dst, groups)
    })

    if (isSol(groups)) return groups
}

function isSol(groups) {
    return Object.values(groups).every(group => group !== null)
}