const fs = require('fs'), path = require('path');
const root = __dirname, w = path.join(root, 'www');
fs.rmSync(w, { recursive: true, force: true });
fs.mkdirSync(path.join(w, 'lib'), { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(w, 'index.html'));
fs.copyFileSync(require.resolve('xlsx/dist/xlsx.full.min.js'), path.join(w, 'lib/xlsx.full.min.js'));
['cairo', 'el-messiri'].forEach(n => fs.cpSync(
  path.join(root, 'node_modules/@fontsource', n), path.join(w, 'fonts', n),
  { recursive: true, filter: s => fs.statSync(s).isDirectory() ||
    /^(index|400|600|700)\.css$/.test(path.basename(s)) ||
    /(arabic|latin)-(400|600|700)-normal\.woff2$/.test(s) }));
console.log('www ready');
