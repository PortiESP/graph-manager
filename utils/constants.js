export default {
    
    // Default values
    DEFAULT_TOOL: "select",
    DEFAULT_SHOW_WEIGHTS: true,
    DEFAULT_ENABLE_MEMENTO: true,
    DEFAULT_ENABLE_CACHE: true,

    // Controls
    SHORTCUT_ARROWS_PAN_SPEED: 25,

    // --- Graph ---

    // Edges
    EDGE_HOVER_THRESHOLD_FACTOR: 2, // The factor to multiply the edge thickness to determine the hover threshold
    ARROW_SIZE: 15,
    EDGE_WEIGHT: 1,
    EDGE_WEIGHT_CONTAINER_FACTOR: 2,  // Horizontal padding of the box containing the weight of the edge
    EDGE_WEIGHT_FONT_SIZE: 12, // Font size of the weight of the edge
    EDGE_THICKNESS_RATIO: .2,
    EDGE_COLOR: "#000000",
    EDGE_WEIGHT_COLOR: "#ffffff",
    EDGE_WEIGHT_BACKGROUND_COLOR: "#000000",
    EDGE_ARROW_SIZE_FACTOR: 3,
    // Nodes
    NODE_RADIUS: 30,
    NODE_BACKGROUND_COLOR: "#ffffff",
    NODE_LABEL_COLOR: "#000000",
    NODE_LABEL_FONT_SIZE: 16,
    NODE_BORDER_COLOR: "#000000",
    NODE_BORDER_RATIO: .15,
    NODE_BUBBLE_RADIUS: 10,
    NODE_BUBBLE_COLOR: "#bb00ff",
    NODE_BUBBLE_TEXT_COLOR: "#ffffff",
    NODE_BUBBLE_TEXT_SIZE: 12,

    // --- Graph Manager ---

    // Grid (default values)
    GRID_ENABLED: true,
    GRID_SIZE: 50,
    GRID_COLOR: "#dddddd",
    GRID_THICKNESS: 1,
    GRID_OPACITY: 1,

    // Style
    BACKGROUND_COLOR: "#eeeeee",

    // Selection box
    SELECTION_BOX_STROKE: "#0000ff",
    SELECTION_BOX_FILL: "rgba(0, 0, 255, 0.1)",
    SELECTION_BOX_THICKNESS: 1,

    // Border colors
    HOVER_BORDER_COLOR: '#0D99FF88',
    SELECTED_BORDER_COLOR: '#0D99FF',
    DELETE_BORDER_COLOR: '#FF0000aa',

    // Focus
    FOCUS_MARGIN: 100,

    // Export
    SVG_EXPORT_MARGIN: 30,

    // Colors
    COLORS_PALETTE: [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
        "#ff8000",
        "#ff0080",
        "#80ff00",
        "#00ff80",
        "#0080ff",
        "#8000ff",
        "#ff8080",
        "#80ff80",
        "#8080ff",
        "#ff80ff",
        "#80ffff",
        "#80ff80",
    ],

    // --- Debug ---

    TEMPLATE_GRAPH: {
        nodes: [
            {x: 0, y: 0, r: 30, id: "A"},
            {x: 100, y: -100, r: 30, id: "B"},
            {x: 100, y: 0, r: 30, id: "C"},
            {x: 100, y: 100, r: 30, id: "D"},
            {x: 200, y: -200, r: 30, id: "E"},
            {x: 200, y: -100, r: 30, id: "F"},
            {x: 200, y: 0, r: 30, id: "G"},
            {x: 200, y: 100, r: 30, id: "H"},
            {x: 200, y: 200, r: 30, id: "I"},
            {x: 300, y: -100, r: 30, id: "J"},
            {x: 400, y: -100, r: 30, id: "K"},
            {x: 300, y: 0, r: 30, id: "L"},
        ],
        edges: [
            {src: "A", dst: "B", weight: 3},
            {src: "A", dst: "C", weight: 7},
            {src: "A", dst: "D", weight: 8},
            {src: "B", dst: "E", weight: 7},
            {src: "B", dst: "F", weight: 2},
            {src: "B", dst: "G", weight: 1},
            {src: "C", dst: "G", weight: 2},
            {src: "D", dst: "H", weight: 3},
            {src: "D", dst: "I", weight: 12},
            {src: "D", dst: "G", weight: 5},
            {src: "E", dst: "J", weight: 3},
            {src: "F", dst: "J", weight: 6},
            {src: "G", dst: "J", weight: 7},
            {src: "G", dst: "L", weight: 4},
            {src: "H", dst: "L", weight: 5},
            {src: "J", dst: "K", weight: 2},
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