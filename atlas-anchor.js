const file = require('./assets/grulita-atlas/grulita-idle.json');
FILENAME = './assets/grulita-atlas/grulita-idle2.json';
METADATA = './assets/grulita-atlas/grulita-idle2-metadata.json';
const fs = require('fs');
const anchorPointConfig = {x: 0.3, y: 0.5};
const targets = [
"AttackA",
"AttackB",
"AttackC",
"AttackD",
"attack_in_jump",
"death",
"hit",
"idle",
"jump_landing",
"jump_mid",
"jump_start",
"run",
];
const prefixes = {};
function parse(file) {
    const atlasFrame = Object.keys(file.frames);
    for (const frame of atlasFrame) {
        const uniqAnim = rootOf(frame);
        
        prefixes[uniqAnim] = (prefixes[uniqAnim] || 0) + 1;

        if (targets.indexOf(uniqAnim) > -1) {

            file.frames[frame]['pivot'] = anchorPointConfig;
        }
    }
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
fs.writeFileSync(FILENAME, JSON.stringify(file,' ', ' '));
fs.writeFileSync(METADATA, JSON.stringify(prefixes,' ', ' '));