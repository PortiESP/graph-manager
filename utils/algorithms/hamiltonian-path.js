/**
 * Hamiltonian path algorithm.
 * 
 * @param {Object} graph - The graph to search for a Hamiltonian path. E.G.: {node1: [Edge, ...], ...}
 * @param {Node|String} start - The node to start the search from.
 * @param {Boolean} all - Whether to return all Hamiltonian paths or just the first one found.
 * @returns {Object} - An object with the path of the Hamiltonian path and all Hamiltonian paths if all is true.
 * - path: {Array[Nodes]} - The path of the Hamiltonian path. If all is true, this is the first Hamiltonian path found.
 * - all: {Array[Arrays]} - All Hamiltonian paths if all is true.
 * @returns {undefined} - If no Hamiltonian path is found.
 */
export default function hamiltonianPath(graph, start, all=false) {
    if (graph === undefined || start === undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // If the start node is a string, turn it into a Node
    if (start.constructor === String) start = window.graph.findNodeById(start)

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