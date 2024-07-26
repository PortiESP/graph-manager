/*
 Hamiltonian Path is a path in a directed or undirected graph that visits each vertex exactly once.

 @param {Object} graph - the graph to find the Hamiltonian Path in {Node: [Edge, ...], ...}
*/
export default function hamiltonianPath(graph, start, all=false) {
    const path = [start]
    const visited = new Set([start])
    const total = Object.keys(graph).length
    all = all ? [] : false


    if (all){
        if (!hamiltonianPathRec(graph, path, visited, total, all)) {
            if (all.length === 0) return undefined
            else return {path: all[0], all}
        }
    } else {
        if (!hamiltonianPathRec(graph, path, visited, total)) return undefined
        else return {path, all}
    }
    
}

function hamiltonianPathRec(graph, path, visited, total, all=false) {
    // Base case: if all vertices have been visited
    if (visited.size === total) {
        if (!all) {
            return true
        } else {
            all.push([...path])
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
            if (hamiltonianPathRec(graph, path, visited, total, all)) {
                return true
            }
            
            // Backtrack
            path.pop()
            visited.delete(nextVertex)
        }
    }
    
    return false
}