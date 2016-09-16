export const red = "#F44336",
    pink = "#E91E63",
    purple = "#9C27B0",
    deepPurple = "#673AB7",
    indigo = "#3F51B5",
    blue = "#2196F3",
    lightBlue = "#03A9F4",
    cyan = "#00BCD4",
    teal = "#009688",
    green = "#4CAF50",
    lightGreen = "#8BC34A",
    lime = "#CDDC39",
    yellow = "#FFEB3B",
    amber = "#FFC107",
    orange = "#FF9800",
    deepOrange = "#FF5722",
    brown = "#795548"

export function randColor(): string {
    const colors = [ 
        red, pink, purple, deepPurple, indigo, blue, lightBlue, 
        cyan, teal, green, lightGreen, lime, yellow, amber, orange, 
        deepOrange, brown 
    ]

    return colors[Math.floor(Math.random() * colors.length)]
}