const path = require('path')
global.require = require
global.__dirname = __dirname
try {
    import('./src/enako3.mjs').then(() => {
        console.log("[start.cjs] ok.")
    }).catch((e) => {
        console.log('[ERROR] start.cjs', e)
    })
} catch (e) {
    console.log('[ERROR] start.cjs', e)
}
