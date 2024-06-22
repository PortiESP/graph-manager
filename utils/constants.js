export default {
    DEFAULT_TOOL: "select",
    TOOLS_KEYS: {
        KeyS: "select",
        KeyE: "edit",
    },
    EDGE_HOVER_THRESHOLD_FACTOR: 2, // The factor to multiply the edge thickness to determine the hover threshold
    ARROW_SIZE: 15,
    EDGE_WEIGHT_BOX_SIZE: 10,  // Horizontal padding of the box containing the weight of the edge
    EDGE_WEIGHT_FONT_SIZE: 16, // Font size of the weight of the edge
    DEFAULT_NODE_RADIUS: 30,
    DEFAULT_EDGE_WEIGHT: 1,
    NODE_DEFAULT_RADIUS: 30,

    // Keybinds
    DELETE_KEY: "Delete",
    NODE_CREATION_KEY: "KeyN",
    EDGE_CREATION_KEY: "KeyE",
    EDGE_WEIGHT_KEY: "KeyW",

    RESET: "Escape",

    // Grid
    GRID_SIZE: 50,
    GRID_COLOR: "#ddd",
    GRID_THICKNESS: 1,

    // Selection box
    SELECTION_BOX_STROKE: "blue",
    SELECTION_BOX_FILL: "rgba(0, 0, 255, 0.1)",
    SELECTION_BOX_THICKNESS: 1,

    // Debug
    TEMPLATE_GRAPH: {
        nodes: [
            {x: 300, y: 300, r: 30, label: "A"},
            {x: 400, y: 400, r: 30, label: "B"},
            {x: 500, y: 500, r: 30, label: "C"},
        ],
        edges: [
            {src: "A", dst: "B", weight: 1},
            {src: "B", dst: "C", weight: 1, directed: true},
        ]
    },
    TEMPLATE_GRAPH_2: `
        A-{5}-B
        C-D
        C-{5.8}-A
        C-E
        D-A
        D-E
        Z
    `,
    TEMPLATE_GRAPH_3: [
        [[0, 1, 10], [0, 2, 3]],
        [[1, 2, 1], [1, 3, 2]],
        [[2, 1, 4], [2, 3, 8], [2, 4, 2]],
        [[3, 4, 7]],
        [[4, 3, 9]]
    ]
}