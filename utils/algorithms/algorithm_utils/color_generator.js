import constants from "../../constants"

export function colorGenerator(nColors){
    const colors = [...constants.COLORS_PALETTE]
    
    if (nColors <= colors.length) return colors
    
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