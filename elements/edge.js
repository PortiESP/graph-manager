import constants from "../utils/constants"
import { Element } from "./element"

/**
 * Edge class
 * 
 * Represents a connection between two nodes in the graph
 * 
 * This class extends the Element class and defines the common properties and methods for edges
 * 
 * @param {Node} src - The source node
 * @param {Node} dst - The destination node
 * @param {number} weight - The weight of the edge
 * @param {boolean} directed - Whether the edge is directed or not
 * 
 * **Properties**
 * 
 * ---
 * 
 * @property {String} id - The id of the edge (inherited from Element)
 * @property {Node} src - The source node
 * @property {Node} dst - The destination node
 * @property {number} weight - The weight of the edge (default: 1)
 * @property {boolean} directed - Whether the edge is directed or not
 * @property {boolean} hover - Whether the edge is being hovered or not
 * @property {boolean} selected - Whether the edge is selected or not (inherited from Element)
 * @property {number} thickness - The thickness of the edge
 * @property {string} edgeColor - The color of the edge
 * @property {string} edgeHoverColor - The color of the edge when hovered
 * @property {string} edgeSelectedColor - The color of the edge when selected
 * @property {string} weightColor - The color of the weight of the edge
 * @property {string} weightBackgroundColor - The background color of the weight of the edge
 * 
 * **Methods**
 * 
 * ---
 * 
 * @method draw - Draw the edge
 * @method distance - Calculate the distance between the edge and a point
 * @method isHover - Check if the edge is being hovered
 * @method moveBy - Move the edge by a certain amount
 * @method clone - Clone the edge
 * @method equals - Check if two edges are equal
 * @method delete - Delete the edge
 */
export class Edge extends Element{
    constructor(src, dst, weight = 1, directed = false) {
        super()

        // Data properties
        this.src = src
        this.dst = dst
        this.weight = weight
        this.directed = directed

        // Style properties
        this.color = "#888"
        this.hoverColor = "#aaa"
        this.selectedColor = "aquamarine"
        this.weightColor = "#eee8"
        this.weightBackgroundColor = "#8888"
        this.hover = false
        this.thickness = 4
    }

    /**
     * Draw the edge
     */
    draw() {
        if (this.hidden) return

        window.ctx.save()  // Save the current state of the canvas

        // Extract the radius of the nodes (used to draw the edge from border to border of the nodes instead of the center)
        const rDst = this.dst.r
        // Arrow head size
        const arrowSize = constants.ARROW_SIZE
        // Calculate edge parameters
        const angle = Math.atan2(this.dst.y - this.src.y, this.dst.x - this.src.x)  // Calculate the angle between the two nodes
        const {src: offsetSrc, dst: offsetDst} = this.nodesIntersectionBorderCoords(0, this.directed ? arrowSize*0.8 : 0) // Calculate the coordinates of the edge from border to border of the nodes instead of the center

        // Determine the color of the edge
        const color =   this.selected ? this.selectedColor :
                        this.isHover() ? this.hoverColor : 
                        this.color

        // Draw the edge
        window.ctx.beginPath()
        window.ctx.strokeStyle = color
        window.ctx.lineWidth = this.thickness
        window.ctx.moveTo(offsetSrc.x, offsetSrc.y)  // Move to the source node
        window.ctx.lineTo(offsetDst.x, offsetDst.y)  // Draw a line to the destination node
        window.ctx.stroke()

        // If the edge is directed, draw an arrow
        if (this.directed) {
            const arrowAngle = Math.PI / 6
            const offsetDstArrow = { x: rDst * Math.cos(angle + Math.PI), y: rDst * Math.sin(angle + Math.PI) } // Calculate the coordinates of the arrow from the border of the node

            // Draw the arrow
            window.ctx.beginPath()
            window.ctx.fillStyle = color
            window.ctx.moveTo(this.dst.x + offsetDstArrow.x, this.dst.y + offsetDstArrow.y)
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle - arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle - arrowAngle))
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle + arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle + arrowAngle))
            window.ctx.fill()
        }

        // Paint the weight of the edge in the middle of the edge
        if (window.graph.showWeights) {
            // Calculate the center of the edge
            const centerX = (this.src.x + this.dst.x) / 2
            const centerY = (this.src.y + this.dst.y) / 2
            
            const fontSize = constants.EDGE_WEIGHT_FONT_SIZE
            const boxSize = constants.EDGE_WEIGHT_BOX_SIZE + String(this.weight).length * 4
            window.ctx.font = fontSize + "px Arial"   
            window.ctx.textAlign = "center"
            window.ctx.textBaseline = "middle"
            window.ctx.fillStyle = this.weightBackgroundColor
            window.ctx.fillRect(centerX - boxSize, centerY - fontSize*0.75, boxSize*2, fontSize*1.25)  // The values hardcoded are calculated to center the box
            window.ctx.fillStyle = this.weightColor
            window.ctx.fillText(this.weight, centerX, centerY)
        }
            
        window.ctx.restore()  // Restore the previous state of the canvas
    }


    /**
     * Calculate the coordinates of the edge from the border of the nodes instead of the center
     * 
     * @param {Number} offsetSrc Offset from border of the source node (positive values move the edge away from the node, negative values move the edge towards the node)
     * @param {Number} offsetDst Offset from border of the destination node (positive values move the edge away from the node, negative values move the edge towards the node)
     * @returns Object. The coordinates of the edge {src: {x, y}, dst: {x, y}}
     */
    nodesIntersectionBorderCoords(offsetSrc=0, offsetDst=0) {
        // Extract the radius of the nodes (used to draw the edge from border to border of the nodes instead of the center)
        const rSrc = this.src.r
        const rDst = this.dst.r

        // Calculate the angle between the two nodes
        const angle = Math.atan2(this.dst.y - this.src.y, this.dst.x - this.src.x)

        // Calculate the offset from the center of the node
        const newSrc = { x: (rSrc+offsetSrc) * Math.cos(angle), y: (rSrc+offsetSrc) * Math.sin(angle) } // Calculate the coordinates of the edge from the border of the node
        const newDst = { x: (rDst+offsetDst) * Math.cos(angle + Math.PI), y: (rDst+offsetDst) * Math.sin(angle + Math.PI) }  // Calculate the coordinates of the other end of the edge from the border of the node (if the edge is not directed, the arrowOffset is 0)

        return {
            src: { x: this.src.x + newSrc.x, y: this.src.y + newSrc.y },
            dst: { x: this.dst.x + newDst.x, y: this.dst.y + newDst.y }
        }
    }

    /**
     * Calculate the distance between the closest point of the edge and a point
     * 
     * @param {Number} x Coordinate x of the point
     * @param {Number} y Coordinate y of the point
     * @returns The distance between the edge and the point
     */
    distance(x, y) {

        // Check if point is inside the bounding box of the edge
        const x1 = Math.min(this.src.x, this.dst.x)
        const x2 = Math.max(this.src.x, this.dst.x)
        const y1 = Math.min(this.src.y, this.dst.y)
        const y2 = Math.max(this.src.y, this.dst.y)

        // If the point is outside the bounding box, return the distance to the closest end of the edge
        if (x < x1 || x > x2 || y < y1 || y > y2) {
            // Return the distance to the closest node
            return Math.min(
                Math.sqrt((this.src.x - x) ** 2 + (this.src.y - y) ** 2), // Distance to the source node
                Math.sqrt((this.dst.x - x) ** 2 + (this.dst.y - y) ** 2)  // Distance to the destination node
            )
        }

        // If the point if inside the bounding box, calculate the distance to the line
        // Distance from a point to a line formula: |Ax + By + C| / sqrt(A^2 + B^2)
        const A = this.src.y - this.dst.y // y1 - y2
        const B = this.dst.x - this.src.x // x2 - x1
        const C = this.src.x * this.dst.y - this.dst.x * this.src.y // x1*y2 - x2*y1
        return Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)
    }

    /**
     * Determine if the edge is being hovered by the mouse
     * 
     * Similar to the distance method, but returns a boolean indicating whether the edge is being hovered or not (plus a slight margin). 
     * 
     * The method used to determine if the mouse is hovering the edge is to calculate a bounding box around the edge considering the slope of the edge as the rotation angle of the bounding box. The bounding box is defined by math functions that verify if a point in the in-side of the bounding box.
     * 
     * @returns Boolean. Whether the edge is being hovered or not
     */
    isHover() {
        // Get the mouse coordinates
        const x = window.cvs.x
        const y = window.cvs.y

        // Src and dst coordinates of the edge (from border to border of the nodes instead of the center)
        const {src, dst} = this.nodesIntersectionBorderCoords()
        
        // Define some constants
        const THRESHOLD = this.thickness * constants.EDGE_HOVER_THRESHOLD_FACTOR  // The threshold to consider the edge as hovered

        // Calculate the slope of the edge
        const slope = (dst.y - src.y) / (dst.x - src.x)

        // Check if the edge is vertical, and if so, check if the mouse is close to the edge using the method for vertical lines, regular non-rotated rectangles. 
        // Checks if the mouse is inside the bounding box of the edge
        if (slope === Infinity || slope === -Infinity) return Math.abs(x - src.x) < THRESHOLD && y > Math.min(src.y, dst.y) && y < Math.max(src.y, dst.y)
        // Horizontal edge
        if (slope === 0) return Math.abs(y - src.y) < THRESHOLD && x > Math.min(src.x, dst.x) && x < Math.max(src.x, dst.x)
        

        // If the edge is not vertical...

        // Calculate some properties of the edge
        const angle = Math.atan(slope)                                    // Angle of the edge
        const angleSign = Math.sign(angle)                                // Sign of the angle (+/-) (used to determine in which side of the edge a point is)
        const anglePerpendicular = angle + Math.PI / 2                    // Angle perpendicular to the edge (used to define the functions intersecting the nodes defining the edge, and that will be used to check if the mouse is inside a rotated bounding box of the edge)
        const slopePerpendicular = Math.tan(anglePerpendicular)           // Slope of the perpendicular line to the edge
        const boundsX = [Math.min(src.x, dst.x), Math.max(src.x, dst.x)] // The leftmost and rightmost x coordinates of the edge: [leftmost, rightmost]

        // Mathematical functions defining the edge and the perpendicular lines intersecting the nodes defining the edge
        const f = (x) => slope * x + src.y - slope * src.x                                   // Function defining the edge
        const fp1 = (x) => slopePerpendicular * x + (f(boundsX[0]) - slopePerpendicular * boundsX[0])  // Perpendicular function to f(x) intersecting the most left point of the edge
        const fp2 = (x) => slopePerpendicular * x + (f(boundsX[1]) - slopePerpendicular * boundsX[1])  // Perpendicular function to f(x) intersecting the most right point of the edge

        // Functions to check the side of the edge a point is
        // The `angleSign` is used to "flip" the inequality sign depending on the slope of the edge
        const inFp1 = (x, y) => angleSign*y > angleSign*fp1(x)  // Check if the point is below the perpendicular function intersecting the most left point of the edge
        const inFp2 = (x, y) => angleSign*y < angleSign*fp2(x)  // Check if the point is above the perpendicular function intersecting the most right point of the edge

        // Distance from the mouse to closest point of the edge (well-known formula for distance from a point to a line)
        const A = src.y - dst.y
        const B = dst.x - src.x
        const C = src.x * dst.y - dst.x * src.y
        const dist = (x,y) => Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)

        // Check if the point is close enough to the edge to be considered hovered
        const isCloseToF = dist(x,y) < THRESHOLD

        // The math functions and the distance to the edge are used to determine if the mouse is inside the bounding box of the edge
        return inFp1(x, y) && inFp2(x, y) && isCloseToF
    }

    /**
     * This method is not implemented for edges, but its necessary to keep the interface consistent with the Node class. 
     * 
     * [i] This is due to the fact that edges position is determined by the position of the nodes they connect, and not by their own position.
     */
    moveBy(){}

    /**
     * Creates a clone of the edge
     * @returns Edge. A clone of the edge
     */
    clone() {
        // Create a new edge with the same properties
        const aux = new Edge(this.src, this.dst, this.weight, this.directed)
        // Copy the rest of the properties
        aux.selected = this.selected
        aux.thickness = this.thickness
        aux.color = this.color
        aux.hoverColor = this.hoverColor
        aux.selectedColor = this.selectedColor
        aux.weightColor = this.weightColor
        aux.weightBackgroundColor = this.weightBackgroundColor
        aux.hover = this.hover
        aux.thickness = this.thickness
        aux.id = this.id

        return aux
    }

    /**
     * Check if two edges are equal. Ignores the style properties and hover property
     * @param {Edge} edge - The edge to compare with
     * @returns Boolean. Whether the two edges are equal or not
     */
    equals(edge) {
        return [ 
            this.src === edge.src,
            this.dst === edge.dst,
            this.weight === edge.weight,
            this.directed === edge.directed,
        ].every(e => e)
    }

    /**
     * Delete the edge from the graph by removing it from the edges array
     */
    delete() {
        window.graph.edges = window.graph.edges.filter(e => e !== this)
    }
}