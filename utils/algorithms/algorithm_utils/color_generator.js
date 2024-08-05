import constants from "../../constants"


/**
 * Generates a list of nColors colors
 * 
 * The first colors are taken from the COLORS_PALETTE constant, if nColors is greater than the length of the palette, random colors are generated
 * 
 * @param {number} nColors - Number of colors to generate
 * 
 * @returns {string[]} List of colors
 */
export function colorGenerator(nColors){
    // The first colors are taken from the palette
    const colors = [...constants.COLORS_PALETTE]
    
    // If the number of colors is less than the length of the palette, return the first nColors colors
    if (nColors <= colors.length) return colors
    
    // If the number of colors is greater than the length of the palette, generate random colors

    // Random color generator
    const letters = '0123456789ABCDEF'
    for (let i = colors.length; i < nColors; i++) {
        let color = "#"
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        colors.push(color)
    }

    return colors

}


/**
 * Generates a list of nColors colors in a gradient from red to green
 * 
 * @param {number} nColors - Number of colors to generate
 * 
 * @returns {string[]} List of colors
 */
export function heatmapColorGenerator(nColors){
    // HSL color generator
    const max = 120  // Green
    const min = 0    // Red
    const range = max - min

    if (nColors === 1) return [`hsl(${max}, 100%, 50%)`]

    const colors = []
    const step = range/(nColors-1)


    for (let i = 0; i < nColors; i++) {
        colors.push(`hsl(${i * step}, 100%, 50%)`)
    }

    // Reverse the colors since the first color is red (we want it to be green)
    return colors.reverse()
}