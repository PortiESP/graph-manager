import constants from "../utils/constants"
import { Element } from "./element"

/**
 * Edge class
 * 
 * Represents a connection between two nodes in the graph
 * 
 * This class extends the Element class and defines the common properties and methods for edges
 * 
 * **Properties**
 * 
 * ---
 * 
 * @property {Node} src - The source node
 * @property {Node} dst - The destination node
 * @property {number} weight - The weight of the edge
 * @property {boolean} directed - Whether the edge is directed or not
 * @property {string} color - The color of the edge
 * @property {string} weightColor - The color of the weight of the edge
 * @property {string} weightBackgroundColor - The background color of the weight of the edge
 * @property {number} arrowSizeFactor - The size factor of the arrow of the edge
 * @property {number} weightContainerFactor - The size factor of the container of the weight of the edge
 * 
 * **Methods**
 * 
 * ---
 * 
 * @method draw - Draw the edge
 * @method resetStyle - Reset the style of the edge
 * @method computeStyle - Compute the style of the edge
 * @method getAdvancedProperties - Calculate some properties of the edge
 * @method nodesIntersectionBorderCoords - Calculate the coordinates of the edge from the border of the nodes instead of the center
 * @method getAdvancedPropertiesByPoint - Calculates several properties of the edge, relative to a point
 * @method distance - Calculate the distance between the closest point of the edge and a point
 * @method isHover - Determine if the edge is being hovered by the mouse
 * @method moveBy - This method is not implemented for edges, but its necessary to keep the interface consistent with the Node class.
 */
export class Edge extends Element{
    constructor(src, dst, weight = 1, directed = false) {
        // If the first argument is an object, copy the properties (clone constructor)
        if (src instanceof Edge) {
            super()
            this.copyFrom(src)
            return
        }
        
        // Parent constructor
        super()

        // Data properties
        this._src = src
        this._dst = dst
        this._weight = weight
        this._directed = directed

        // Style properties
        this._color = constants.EDGE_COLOR
        this._weightColor = constants.EDGE_WEIGHT_COLOR
        this._weightBackgroundColor = constants.EDGE_WEIGHT_BACKGROUND_COLOR
        this._arrowSizeFactor = constants.EDGE_ARROW_SIZE_FACTOR
        this._weightContainerFactor = constants.EDGE_WEIGHT_CONTAINER_FACTOR

        // Initialize the style (after all the properties have been set)
        this.resetStyle()
    }

    /**
     * Draw the edge
     */
    draw() {
        // If the edge is hidden, do not draw it
        if (this.hidden) return  

        window.ctx.save()  // Save the current state of the canvas

        // Set the style properties
        const style = this.style

        // Set the opacity of the edge
        window.ctx.globalAlpha = style.opacity

        // Extract coordinates of the intersection of the nodes borders
        const arrowSize = style.thickness * style.arrowSizeFactor
        const { borderSrc, borderDst, angle } = this.nodesIntersectionBorderCoords(0, this.directed ? arrowSize*0.8 : 0) // Calculate the coordinates of the edge from border to border of the nodes instead of the center

        // If the edge is directed, draw an arrow
        if (this.directed) {
            const rDst = this.dst.isFake ? 0 : this.dst.r  // If the destination node is a fake node, set the radius to 0
    
            // Draw the edge
            window.ctx.beginPath()
            window.ctx.strokeStyle = style.color
            window.ctx.lineWidth = style.thickness
            window.ctx.moveTo(this.src.x, this.src.y)  // Move to the source node
            window.ctx.lineTo(borderDst.x, borderDst.y)  // Draw a line to the destination node
            window.ctx.stroke()

            const arrowAngle = Math.PI / 6
            const offsetDstArrow = { x: rDst * Math.cos(angle + Math.PI), y: rDst * Math.sin(angle + Math.PI) } // Calculate the coordinates of the arrow from the border of the node

            // Draw the arrow
            window.ctx.beginPath()
            window.ctx.fillStyle = style.color
            window.ctx.moveTo(this.dst.x + offsetDstArrow.x, this.dst.y + offsetDstArrow.y)
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle - arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle - arrowAngle))
            window.ctx.lineTo(this.dst.x + offsetDstArrow.x - arrowSize * Math.cos(angle + arrowAngle), this.dst.y + offsetDstArrow.y - arrowSize * Math.sin(angle + arrowAngle))
            window.ctx.fill()
        } else {
            // Draw the edge
            window.ctx.beginPath()
            window.ctx.strokeStyle = style.color
            window.ctx.lineWidth = style.thickness
            window.ctx.moveTo(this.src.x, this.src.y)  
            window.ctx.lineTo(this.dst.x, this.dst.y)
            window.ctx.stroke()
        }

        // Paint the weight of the edge in the middle of the edge
        if (window.graph.showWeights) {
            // Calculate the center of the edge
            const centerX = (borderSrc.x + borderDst.x) / 2
            const centerY = (borderSrc.y + borderDst.y) / 2
            
            window.ctx.font = style.weightContainerSize + "px Arial"   
            window.ctx.textAlign = "center"
            window.ctx.textBaseline = "middle"
            window.ctx.fillStyle = (style.weightColor && style.weightBackgroundColor) || "#0000"
            // Draw circle background
            window.ctx.beginPath()
            window.ctx.arc(centerX, centerY, style.weightContainerSize, 0, 2 * Math.PI)
            window.ctx.fillStyle = style.weightBackgroundColor ?? "#0000"
            window.ctx.fill()
            // Draw the weight
            window.ctx.fillStyle = style.weightColor ?? "#0000"
            window.ctx.fillText(this.weight, centerX, centerY)  // Add 1 to the y coordinate to center the text
        }

        // Draw the edge selection
        if (this.selected || this.isHover()) {
            const color = this.selected ? style.selectedColor 
                        : window.graph.tool === "delete" ? style.deleteColor
                        : style.hoverColor

            window.ctx.beginPath()
            window.ctx.strokeStyle = color
            window.ctx.lineWidth = 2/window.cvs.zoom
            window.ctx.moveTo(this.src.x, this.src.y)
            window.ctx.lineTo(this.dst.x, this.dst.y)
            window.ctx.stroke()
        }

        // Debug
        // If the destination node is not defined (e.g. when the node is not a real node, but an aux node for the edge being created), do not draw the distance
        if (window.cvs.debug && this.dst.id !== undefined){
            // Draw the distance to the edge
            window.ctx.fillStyle = "purple"
            window.ctx.font = "7px Arial"
            const data = this.getAdvancedPropertiesByPoint(window.cvs.x, window.cvs.y)
            window.ctx.fillText(this.id, (borderSrc.x + borderDst.x) / 2, (borderSrc.y + borderDst.y) / 2 + 15)
            window.ctx.fillText(data.dist.toFixed(2), (borderSrc.x + borderDst.x) / 2, (borderSrc.y + borderDst.y) / 2 + 25)
        }
            
        window.ctx.restore()  // Restore the previous state of the canvas
    }


    /**
     * Reset the style of the edge
     * 
     * This will set the values of the `this.style` object to the default values (defined in instance itself) and then call the `computeStyle` method to calculate the style properties based on the new values of the style object
     */
    resetStyle() {
        super.resetStyle()  // Reset the style of the parent class
        this.style.color = this.color
        this.style.weightColor = this.weightColor
        this.style.weightBackgroundColor = this.weightBackgroundColor
        this.style.arrowSizeFactor = this.arrowSizeFactor
        this.style.weightContainerFactor = this.weightContainerFactor
        
        // Computed
        this.computeStyle()
    }
    

    /**
     * Compute the style of the edge
     * 
     * This method is called after the style properties have been set to calculate the style properties based on the current values of the element
     */
    computeStyle() {
        this.style.thickness = Math.min(this.src?.r, this.dst?.r) * constants.EDGE_THICKNESS_RATIO
        this.style.weightContainerSize = this.style.thickness * this.weightContainerFactor
        this.style.weightFontSize = this.style.weightContainerSize * 0.8
    }


    /**
     * Calculate some properties of the edge
     * 
     * @returns {Object} Properties of the edge:
     * @returns {Object.Object} `borderSrc` - The coordinates of the edge from the border of the source node
     * @returns {Object.Object} `borderDst` - The coordinates of the edge from the border of the destination node
     * @returns {Object.Number} `angle` - The angle of the edge
     * @returns {Object.Node} `leftNode` - The node on the left side of the edge
     * @returns {Object.Node} `rightNode` - The node on the right side of the edge
     * @returns {Object.Number} `slope` - The slope of the edge
     */
    getAdvancedProperties() {
        const {borderSrc, borderDst, angle} = this.nodesIntersectionBorderCoords(0, 0)

        const leftNode = this.src.x < this.dst.x ? this.src : this.dst
        const rightNode = this.src.x < this.dst.x ? this.dst : this.src
        const slope = (rightNode.y - leftNode.y) / (rightNode.x - leftNode.x)

        return {
            borderSrc,
            borderDst,
            angle,
            leftNode,
            rightNode,
            angle,
            slope
        }
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
        const rDst = this.dst.isFake ? 0: this.dst.r  // If the destination node is a fake node, set the radius to 0

        // Calculate the angle between the two nodes
        const angle = Math.atan2(this.dst.y - this.src.y, this.dst.x - this.src.x)

        // Calculate the offset from the center of the node
        const newSrc = { x: (rSrc+offsetSrc) * Math.cos(angle), y: (rSrc+offsetSrc) * Math.sin(angle) } // Calculate the coordinates of the edge from the border of the node
        const newDst = { x: (rDst+offsetDst) * Math.cos(angle + Math.PI), y: (rDst+offsetDst) * Math.sin(angle + Math.PI) }  // Calculate the coordinates of the other end of the edge from the border of the node (if the edge is not directed, the arrowOffset is 0)

        return {
            borderSrc: { x: this.src.x + newSrc.x, y: this.src.y + newSrc.y },
            borderDst: { x: this.dst.x + newDst.x, y: this.dst.y + newDst.y },
            angle
        }
    }



    /**
     * Calculates several properties of the edge, relative to a point
     * 
     * @param {Number} x Coordinate x of the point
     * @param {Number} y Coordinate y of the point
     * 
     * @returns {Object} Properties of the edge:
     * @returns {Object.Number} `dist` - The distance between the edge and the point
     * @returns {Object.Number} `slope` - The slope of the edge (between the source and destination nodes, the point is irrelevant here)
     * @returns {Object.Number} `angle` - The angle of the edge (between the source and destination nodes, the point is irrelevant here)
     * @returns {Object.Boolean} `isInsidePFuncs` - Whether the point is inside the perpendicular functions intersecting the nodes defining the edge
     * @returns {Object.Number} `distToClosestNode` - The distance between the point and the closest node
     * @returns {Object.Number} `distToSrc` - The distance between the point and the source node
     * @returns {Object.Number} `distToDst` - The distance between the point and the destination node
     * @returns {Object.Number} `distUnbounded` - The distance between the point and the edge without taking into account the perpendicular functions
     */
    getAdvancedPropertiesByPoint(x, y) {
        // Src and dst coordinates of the edge (from border to border of the nodes instead of the center)
        const {borderSrc, borderDst, angle, slope, leftNode, rightNode} = this.getAdvancedProperties()

        // Calculate the slope of the edge
        const angleSign = Math.sign(angle)                                // Sign of the angle (+/-) (used to determine in which side of the edge a point is)
        const anglePerpendicular = angle + Math.PI / 2                    // Angle perpendicular to the edge (used to define the functions intersecting the nodes defining the edge, and that will be used to check if the mouse is inside a rotated bounding box of the edge)
        const slopePerpendicular = Math.tan(anglePerpendicular)           // Slope of the perpendicular line to the edge
        const boundsXByBorder = [Math.min(borderSrc.x, borderDst.x), Math.max(borderSrc.x, borderDst.x)] // The leftmost and rightmost x coordinates of the edge: [leftmost, rightmost]

        let result;

        // Check if the edge is vertical, and if so, calculate the distance using the formula for vertical lines
        if (slope === Infinity || slope === -Infinity) {
            const minY = Math.min(borderSrc.y, borderDst.y)
            const maxY = Math.max(borderSrc.y, borderDst.y)
            const isInsidePFuncs = minY < y && y < maxY
            const distUnbounded = Math.abs(x - borderSrc.x)
            const distToSrc = Math.hypot(x - borderSrc.x, y - borderSrc.y)
            const distToDst = Math.hypot(x - borderDst.x, y - borderDst.y)
            const distToClosestNode = Math.min(distToSrc, distToDst)
            const dist = isInsidePFuncs
                            ? distUnbounded
                            : distToClosestNode
            
            result = {dist, isInsidePFuncs, distToClosestNode, distToSrc, distToDst, distUnbounded}
        }
        // Check if the edge is horizontal, and if so, calculate the distance using the formula for horizontal lines
        else if (slope === 0) {
            const minX = Math.min(borderSrc.x, borderDst.x)
            const maxX = Math.max(borderSrc.x, borderDst.x)
            const isInsidePFuncs = minX < x && x < maxX
            const distUnbounded = Math.abs(y - borderSrc.y)
            const distToSrc = Math.hypot(x - borderSrc.x, y - borderSrc.y)
            const distToDst = Math.hypot(x - borderDst.x, y - borderDst.y)
            const distToClosestNode = Math.min(distToSrc, distToDst)
            const dist = isInsidePFuncs
                            ? distUnbounded
                            : distToClosestNode

            result = {dist, isInsidePFuncs, distToClosestNode, distToSrc, distToDst, distUnbounded}
        }
        // If the edge is not vertical or horizontal, calculate the distance using the formula for any line
        else {           
            // Mathematical functions defining the edge and the perpendicular lines intersecting the nodes defining the edge
            const f = (x) => slope * x + leftNode.y - slope * leftNode.x                                   // Function defining the edge
            const fp1 = (x) => slopePerpendicular * x + (f(boundsXByBorder[0]) - slopePerpendicular * boundsXByBorder[0])  // Perpendicular function to f(x) intersecting the most left point of the edge
            const fp2 = (x) => slopePerpendicular * x + (f(boundsXByBorder[1]) - slopePerpendicular * boundsXByBorder[1])  // Perpendicular function to f(x) intersecting the most right point of the edge
    
            // Functions to check the side of the edge a point is
            // The `angleSign` is used to "flip" the inequality sign depending on the angle of the edge
            const inverted = borderSrc.x > borderDst.x ? -1 : 1  // Invert the scr node is on the right of the dst node
            const sign = angleSign*inverted
            const inFp1 = (x, y) => sign*y > sign*fp1(x)  // Check if the point is below the perpendicular function intersecting the most left point of the edge
            const inFp2 = (x, y) => sign*y < sign*fp2(x)  // Check if the point is above the perpendicular function intersecting the most right point of the edge
    
            // Distance from the mouse to closest point of the edge (well-known formula for distance from a point to a line)
            const A = leftNode.y - rightNode.y
            const B = rightNode.x - leftNode.x
            const C = leftNode.x * rightNode.y - rightNode.x * leftNode.y
            const distToEdgeFunc = (x,y) => Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)
    
            // Check if the point in between the two perpendicular lines intersecting the nodes defining the edge
            const isInsidePFuncs = inFp1(x, y) && inFp2(x, y)
            const distUnbounded = distToEdgeFunc(x, y)  // Distance to the edge without taking into account the perpendicular functions
            const distToSrc = Math.hypot(x - borderSrc.x, y - borderSrc.y)
            const distToDst = Math.hypot(x - borderDst.x, y - borderDst.y)
            const distToClosestNode = Math.min(distToSrc, distToDst)  // Distance to the closest node
    
            // Calculate the distance to the edge, taking into account that if the point is not inside the perpendicular functions, the distance is the distance to the closest node
            const dist = isInsidePFuncs
                            ? distUnbounded 
                            : distToClosestNode

            result = {dist, isInsidePFuncs, distToClosestNode, distToSrc, distToDst, distUnbounded}
        }

        return {...result, slope, angle, leftNode, rightNode}
    }

    /**
     * Calculate the distance between the closest point of the edge and a point
     * 
     * @param {Number} x Coordinate x of the point
     * @param {Number} y Coordinate y of the point
     * @returns The distance between the edge and the point
     */
    distance(x, y) {
        const {dist} = this.getAdvancedPropertiesByPoint(x, y)
        if (dist === undefined) throw new Error("Distance is undefined")
        return dist
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
        // Check if the edge is hidden, if so, return false
        if (this.hidden || this.dst.isFake) return false

        // Get the mouse coordinates
        const x = window.cvs.x
        const y = window.cvs.y

        // Define some constants
        const THRESHOLD = this.style.thickness * constants.EDGE_HOVER_THRESHOLD_FACTOR  // The threshold to consider the edge as hovered

        // Get the advanced properties of the edge
        const {dist, isInsidePFuncs} = this.getAdvancedPropertiesByPoint(x, y)

        // Check if the distance to the edge is less than the threshold and the point is inside the bounding box
        return isInsidePFuncs 
                ? dist < THRESHOLD
                : false
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
        window.graph.disableListeners = true // Disable the listeners temporarily

        // Create a new edge with the same properties
        const aux = new Edge(this.src, this.dst, this.weight, this.directed)
        // Copy the all the properties
        Object.assign(aux, this)

        window.graph.disableListeners = false // Enable the listeners again
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
        super.delete()
        window.graph.edges = window.graph.edges.filter(e => e !== this)
    }


    // ======================================================= Getters and Setters =======================================================

    get src() { return this._src }
    set src(src) { this._src = src 
        // Update the style
        this.computeStyle()
    }

    get dst() { return this._dst }
    set dst(dst) { this._dst = dst 
        // Update the style
        this.computeStyle()
    }

    get weight() { return this._weight }
    set weight(weight) { this._weight = weight }

    get directed() { return this._directed }
    set directed(directed) { this._directed = directed }

    get color() { return this._color }
    set color(color) { this._color = color }

    get weightColor() { return this._weightColor }
    set weightColor(weightColor) { this._weightColor = weightColor }

    get weightBackgroundColor() { return this._weightBackgroundColor }
    set weightBackgroundColor(weightBackgroundColor) { this._weightBackgroundColor = weightBackgroundColor }

    get arrowSizeFactor() { return this._arrowSizeFactor }
    set arrowSizeFactor(arrowSizeFactor) { this._arrowSizeFactor = arrowSizeFactor }

    get weightContainerFactor() { return this._weightContainerFactor }
    set weightContainerFactor(weightContainerFactor) { this._weightContainerFactor = weightContainerFactor 
        // Update the style
        this.computeStyle()
    }
}