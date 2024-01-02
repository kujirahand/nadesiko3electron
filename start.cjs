const path = require('path')
global.require = require
global.__dirname = __dirname
const a_path = path.join(__dirname, 'src', 'enako3.mjs')
console.log("[start.cjs] path=", a_path)
try {
    import(a_path)
} catch (e) {
    console.log('[ERROR] start.cjs', e)
}
