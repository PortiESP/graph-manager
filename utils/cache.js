import { Edge } from "../elements/edge"
import { Node } from "../elements/node"
import { loadFromJSON } from "./load_graph"

// Key used to store the cache in local storage
const CACHE_KEY = "graph-cached"


/**
 * Save the current state of the graph to the cache. 
 * 
 * The cache is saved to the local storage, and it includes the nodes, edges, and selected nodes. The properties related to the current view are discarded.
 */
export function saveToCache() {
    // If the cache is disabled, return
    if (window.graph.enableCache === false) return

    // Create a cache object
    const cache = {
        // Save the nodes, but discard the properties related to the current view
        nodes: window.graph.nodes.map(node => {
            return {
                ...node,
                // View related properties are set to its default value
                bubble: null,
                hidden: false,
                selected: false,
            }
        }),
        // Save the edges, but discard the properties related to the current view
        edges: window.graph.edges.map(edge => {
            return {
                ...edge,
                src: edge.src.id,
                dst: edge.dst.id,
                // View related properties are set to its default value
                hidden: false,
                selected: false,
            }
        }),
        // Save the selected nodes
        selected: window.graph.selected.map(node => node.id),
    }
    // Save to local storage
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

    // Debug
    if (window.cvs.debug) console.log("Saving to cache: ", cache)
}


/**
 * Load the graph from the cache.
 * 
 * @returns {boolean} True if the cache was loaded successfully, false otherwise.
 */
export function loadFromCache() {
    // If the cache is disabled, return false
    if (window.graph.enableCache === false) return false

    // Load the cache from local storage
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY))

    // Debug
    if (window.cvs.debug) console.log("Loading from cache: ", cache)

    // If there is no cache, return false
    if (!cache) return false

    // Load the cache into the graph
    loadFromJSON(cache)

    // Return true to indicate that the cache was loaded successfully
    return true
}


/**
 * Delete the graph saved in the cache.
 */
export function clearCache() {
    localStorage.removeItem(CACHE_KEY)
}