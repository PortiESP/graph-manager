/*
 Hamiltonian cycle algorithm

 @param {Object} graph - the graph to find the Hamiltonian cycle in {Node: [Edge, ...], ...}
*/
export default function hamiltonianCycle(graph, start, all=false) {
    const path = [start]
    const visited = new Set([start])
    const total = Object.keys(graph).length
    all = all ? [] : false


    if (all){
        if (!hamiltonianCycleRec(graph, path, visited, total, all)) {
            if (all.length === 0) return undefined
            else return {path: all[0], all}
        }
    } else {
        if (!hamiltonianCycleRec(graph, path, visited, total)) return undefined
        else return {path, all}
    }
    
}

function isCycle(graph, path) {
    const start = path[0]
    const end = path[path.length - 1]
    const edges = graph[end]
    return edges.some(edge => edge.dst === start)
}


function hamiltonianCycleRec(graph, path, visited, total, all=false) {
    // Base case: if all vertices have been visited
    if (visited.size === total) {
        if (!isCycle(graph, path)) return false

        if (!all) {
            path.push(path[0])
            return true
        } else {
            all.push([...path, path[0]])
            return false
        }
    }
    
    // Recursive case: visit all unvisited vertices

    // Get the last vertex in the path and its edges
    const lastVertex = path[path.length - 1]
    const edges = graph[lastVertex]
    
    // Visit each edge
    for (let i = 0; i < edges.length; i++) {
        const nextVertex = edges[i].dst  // Get the next vertex
        
        // If the next vertex has not been visited, visit it
        if (!visited.has(nextVertex)) {
            // Add the vertex to the current solution
            path.push(nextVertex)
            visited.add(nextVertex)
            
            // Recur to construct the rest of the path
            if (hamiltonianCycleRec(graph, path, visited, total, all)) {
                return true
            }
            
            // Backtrack
            path.pop()
            visited.delete(nextVertex)
        }
    }
    
    return false
}