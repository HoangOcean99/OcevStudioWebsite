const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}
const files = walk('E:/LamViec/OcevStudio/SourceCodeWebsite/OcevStudioWebsite/frontend/src/app');
files.push(...walk('E:/LamViec/OcevStudio/SourceCodeWebsite/OcevStudioWebsite/frontend/src/components'));
const dictStr = fs.readFileSync('E:/LamViec/OcevStudio/SourceCodeWebsite/OcevStudioWebsite/frontend/src/i18n/dictionaries.ts', 'utf8');
const missing = [];
files.forEach(f => {
    const c = fs.readFileSync(f, 'utf8');
    const matches = c.match(/t\(['"](.*?)['"]\)/g);
    if(matches) {
        matches.forEach(m => {
            const key = m.match(/t\(['"](.*?)['"]\)/)[1];
            if(!dictStr.includes(key + '"') && !dictStr.includes(key + ':') && !dictStr.includes('"' + key + '"')) {
                missing.push(key);
            }
        });
    }
});
console.log([...new Set(missing)]);
