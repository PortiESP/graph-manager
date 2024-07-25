/*
    Kruskal's algorithm for finding the minimum spanning tree of a graph
*/
export default function kruskal(graph) {
    if (graph === undefined) throw new Error('Invalid graph')

    const getCandidates = (graph) => {
        const candidates = []
        for (const edges of Object.values(graph)) {
            for (const edge of edges) {
                if (candidates.some(e => e.id === edge.id)) continue
                candidates.push(edge)
            }
        }

        return candidates.sort((a, b) => a.weight - b.weight)
    }

    const n = Object.keys(graph).length
    const candidates = getCandidates(graph)
    const conexComps = Object.fromEntries(Object.keys(graph).map(node => [node, [node]]))
    const result = []
    let conexCompsNum = n
    let totalWeight = 0

    while (candidates.length && conexCompsNum > 1) {
        const edge = candidates.shift()
        const {src, dst, weight} = edge

        if (conexComps[src] !== conexComps[dst]) {
            result.push(edge)
            totalWeight += weight

            const newComp = conexComps[src].concat(conexComps[dst])
            newComp.forEach(node => conexComps[node] = newComp)
            conexCompsNum--
        }
    }

    return {result, totalWeight}
}