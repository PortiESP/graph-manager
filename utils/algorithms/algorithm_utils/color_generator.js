import constants from "../../constants"

export default function colorGenerator(nColors){
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