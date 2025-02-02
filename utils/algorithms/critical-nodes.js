import { Node } from "@components/graph-manager/elements/node"
import conexComps from "./conex-comp"

function bfs(graph, start, visited=undefined, skipNode=undefined) {
    // Initial checks
    if (graph===undefined || start===undefined) throw new Error('Invalid graph or start node')
    if (graph[start] === undefined) throw new Error('Start node not found in the graph')

    // Initialize the variables
    const queue = [start]
    const result = []
    const prevNode = Object.fromEntries(Object.keys(graph).map(node => [node, null]))  // Initialize the previous node for each node as null

    // If the visited object was not provided, create a new one with all the nodes set to false
    // The visited object represents the nodes that are already in the queue
    if (visited === undefined) visited = Object.fromEntries(Object.keys(graph).map(node => [node, false]))

    if (skipNode.constructor === Node) skipNode = skipNode.id

    // Mark the start node as visited and set the previous node as null
    visited[start] = true
    prevNode[start] = null

    // While the queue is not empty
    while (queue.length) {
        // Get the first element of the queue
        const node = queue.shift()

        // Add the node to the result
        result.push(node)

        // For each neighbor
        const neighbors = graph[node] || []
        for (const {dst} of neighbors) {
            if (skipNode && dst.id === skipNode) continue

            if (!visited[dst]) {     // If the neighbor is not visited (visited represents the nodes that are already in the queue)
                queue.push(dst)      // Add the neighbor to the queue
                visited[dst] = true  // Mark the neighbor as visited
                prevNode[dst] = node // Save the current node as the previous node for the neighbor          
            }
        }
    }

    // Return the result, the visited nodes and the previous node for each node
    return {result, visited, prevNode}
}

export function criticalNodes(graph) {
    // Initial checks
    if (graph === undefined) throw new Error('Invalid graph')
    
    // Check if the graph is connected
    const conectedComps = conexComps(graph)
    // Initialize the critical nodes
    const criticalNodes = []

    for (const comp of conectedComps){
        // For each node in the graph
        if (comp.length <= 1) continue

        const compIds = comp.map(node => node.id)

        for (const node of comp) {
            // Perform a BFS starting from the current node
            const startNode = comp[0] === node ? comp[1] : comp[0]
            const {visited} = bfs(graph, startNode, undefined, node)
            visited[node] = true
    
            // If there is a node that is not visited, then the current node is a critical node
            if (Object.entries(visited).some(([node, visited]) => compIds.includes(node) && !visited)) {
                criticalNodes.push(node)
            }
        }
    }


    // Return the critical nodes
    return criticalNodes
}