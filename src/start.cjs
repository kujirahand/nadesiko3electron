const path = require('path')
global.require = require
global.__dirname = __dirname
try {
    import('./enako3.mjs').then(() => {
        console.log("[start.cjs] ok.")
    }).catch((e) => {
        console.error('[ERROR::import(enako3.mjs)] start.cjs', e)
    })
} catch (e) {
    console.error('[ERROR::catch] start.cjs', e)
}
