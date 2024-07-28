import { Edge } from "../elements/edge"
import { Node } from "../elements/node"

const CACHE_KEY = "graph-cached"

export function saveToCache() {
    if (window.graph.enableCache === false) return

    const cache = {
        nodes: window.graph.nodes.map(node => {
            return {
                ...node,
                // View related properties are discarded
                bubble: null
            }
        }),
        edges: window.graph.edges.map(edge => {
            return {
                ...edge,
                src: edge.src.id,
                dst: edge.dst.id,
                // View related properties are discarded
                hidden: false,
            }
        }),
        selected: window.graph.selected.map(node => node.id),
    }
    // Save to local storage
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))

    // Debug
    if (window.cvs.debug) console.log("Saving to cache: ", cache)
}

export function loadFromCache() {
    if (window.graph.enableCache === false) return false

    const cache = JSON.parse(localStorage.getItem(CACHE_KEY))

    // Debug
    if (window.cvs.debug) console.log("Loading from cache: ", cache)
    // If there is no cache, return false
    if (!cache) return false

    window.graph.nodes = cache.nodes.map(node => new Node(node))
    window.graph.edges = cache.edges.map(edge => new Edge(edge))
    window.graph.selected = cache.selected.map(id => window.graph.nodes.find(node => node.id === id))

    // Fix the references of the edges
    window.graph.edges.forEach(edge => {
        edge.src = window.graph.nodes.find(node => node.id === edge.src)
        edge.dst = window.graph.nodes.find(node => node.id === edge.dst)
    })
    return true
}