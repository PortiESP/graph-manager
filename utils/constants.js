export default {
    DEFAULT_TOOL: "select",
    TOOLS_KEYS: {
        KeyS: "select",
        Escape: "select",
        KeyE: "edges",
        KeyN: "add-nodes",
        KeyD: "delete",
    },
    EDGE_HOVER_THRESHOLD_FACTOR: 2, // The factor to multiply the edge thickness to determine the hover threshold
    ARROW_SIZE: 15,
    EDGE_WEIGHT: 1,
    EDGE_WEIGHT_CONTAINER_SIZE_FACTOR: 5,  // Horizontal padding of the box containing the weight of the edge
    EDGE_WEIGHT_FONT_SIZE: 12, // Font size of the weight of the edge
    EDGE_THICKNESS: 4,
    EDGE_COLOR: "#000",
    EDGE_WEIGHT_COLOR: "#fff",
    EDGE_WEIGHT_BACKGROUND_COLOR: "#000",
    EDGE_ARROW_SIZE_FACTOR: 3,

    NODE_RADIUS: 30,
    NODE_BACKGROUND_COLOR: "#fff",
    NODE_LABEL_COLOR: "#000",
    NODE_LABEL_FONT_SIZE: 20,
    NODE_BORDER_COLOR: "#000",
    NODE_BORDER_WIDTH: 4,
    NODE_BUBBLE_RADIUS: 10,
    NODE_BUBBLE_COLOR: "purple",
    NODE_BUBBLE_TEXT_COLOR: "white",

    // Keybinds
    DELETE_KEY: "Delete",
    NODE_CREATION_KEY: "KeyN",
    EDGE_CREATION_KEY: "KeyE",
    EDGE_WEIGHT_KEY: "KeyW",
    RESET: "Escape",
    SNAP_TO_GRID: "shift",
    SNAP_TO_GRID_KEYS: ["ShiftLeft", "ShiftRight"],

    // Grid (default values)
    GRID_ENABLED: true,
    GRID_SIZE: 50,
    GRID_COLOR: "#dddddd",
    GRID_THICKNESS: 1,
    GRID_OPACITY: 1,

    // Style
    BACKGROUND_COLOR: "#eeeeee",

    // Selection box
    SELECTION_BOX_STROKE: "blue",
    SELECTION_BOX_FILL: "rgba(0, 0, 255, 0.1)",
    SELECTION_BOX_THICKNESS: 1,

    // Focus
    FOCUS_MARGIN: 100,

    // Debug
    TEMPLATE_GRAPH: {
        nodes: [
            {x: 300, y: 300, r: 30, id: "A"},
            {x: 400, y: 400, r: 30, id: "B"},
            {x: 500, y: 500, r: 30, id: "C"},
        ],
        edges: [
            {src: "A", dst: "B", weight: 1},
            {src: "B", dst: "C", weight: 1, directed: true},
        ]
    },
    TEMPLATE_GRAPH_2: `
        A 2 B
        A 4 C 
        A D
        B 3 C
        B 2 E
        C 2 F
        C 3 G
        D 4 H
        D I
        E 5 J
        E 2 K
        F 3 L
        F 4 M
        G N
        G 2 O
        H 5 P
        H 3 Q
        I 4 R
        I 2 S
        J T
        J 3 A
        K 2 L
        K 4 M
        L 3 N
        L O
        M 5 P
        M 2 Q
        N 4 R
        N 3 S
        O T
        O 2 A
        P 3 B
        P 4 C
        Q 2 D
        Q 5 E
        R F
        R 3 G
        S 4 H
        S 2 I
        T 3 J
        T K
    `,
    TEMPLATE_GRAPH_3: [
        [[0, 1, 10], [0, 2, 3]],
        [[1, 2, 1], [1, 3, 2]],
        [[2, 1, 4], [2, 3, 8], [2, 4, 2]],
        [[3, 4, 7]],
        [[4, 3, 9]]
        // [["A", "B", 1], ["A", "C", 1]],
        // [["B", "C", 1], ["B", "D", 1]],
        // [["C", "B", 1], ["C", "D", 1], ["C", "E", 1]],
        // [["D", "E", 1]],
        // [["E", "D", 1]]
    ],
    TEMPLATE_GRAPH_TOPO: `
        A>B
        A>C
        B>D
        C>D
        D>E
        E
    `
}