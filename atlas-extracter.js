const file = require('./assets/grulita-atlas/texture.json');
const fs = require('fs');
const prefixes = {};
FILENAME = "grulita.json";
function parse(file) {
    const root = file.textures[0].frames;
    for (let frame of root) {
        const name = frame.filename;
        const uniqAnim = rootOf(name);
        
        prefixes[uniqAnim] = (prefixes[uniqAnim] || 0) + 1;
    }
    console.log(prefixes);
}

function rootOf(str) {
    for (let char of str) {
        const chars = ['1','2','3','4','5','6','7','8','9','0'];
        const idx = chars.indexOf(char);
        if (idx > -1) {
            const i = str.indexOf(chars[idx]);
            return str.substring(0,i);
        }
    }
    return str;
}

parse(file);
fs.writeFileSync('./'+FILENAME, JSON.stringify(prefixes,' ', ' '));