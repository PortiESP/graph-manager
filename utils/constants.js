export default {
    DEFAULT_TOOL: "select",
    TOOLS_KEYS: {
        KeyS: "select",
        KeyE: "edit",
    },
    EDGE_DETECTION_RADIUS: 10,
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
            {x: 300, y: 400, r: 30, label: "B"},
            {x: 400, y: 400, r: 30, label: "C"},
            {x: 400, y: 500, r: 30, label: "D"},
        ],
        edges: [
            {src: "A", dst: "C", weight: 1},
            {src: "B", dst: "C", weight: 3},
            {src: "C", dst: "D", weight: 5},
            {src: "D", dst: "B", weight: 2, directed: true},
        ]
    },
    TEMPLATE_GRAPH_2: `
        A-{5}->B
        C->D
        C-{5.8}->A
        C->E
        D->A
        D->E
        X
        Y
        Z
    `
}