function get(obj, key, defaultValue = "") {
    if (typeof obj !== 'object') return
    let arr = key.replace(/\[/g, '.').replace(/\]/, '').split('.')
    return arr.reduce((acc, cur) => (acc || {})[cur], obj) || defaultValue
}

export { get }