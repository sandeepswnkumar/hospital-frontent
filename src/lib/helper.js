export function getFirstTwoChars(str) {
    if (str === undefined) {
        return ''
    }
    if (str.split(' ').length > 1) {
        return str
            .split(' ')
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join('')
    } else {
        return str
            .split('')
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join('')
    }
}