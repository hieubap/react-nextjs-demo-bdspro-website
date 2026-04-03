const fs = require('fs');

const __dir = '../src/Resources/Svg';
const src = __dir;
const srcJson = __dir + '/index.ts';

const keys = {};

function toCamelCase(str) {
  // Bỏ phần mở rộng như .svg
  const withoutExtension = str.split('.')[0];
  // Tách theo các ký tự: -, _, ., /
  const parts = withoutExtension.split(/[-_./]/);
  // Viết hoa chữ cái đầu mỗi phần
  const camelCase = parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  // Thêm 'SVG' nếu là file .svg
  return str.endsWith('.svg') ? camelCase + 'SVG' : camelCase;
}

const deepRead = path => {
  if (fs.lstatSync(src + path).isDirectory()) {
    for (let p of fs.readdirSync(src + path)) {
      if (p[0] == '.' || !p.endsWith('.svg')) continue;
      deepRead(path + '/' + p);
    }
  } else {
    // const kr = path.replaceAll('/', '_').replaceAll('-', '_').substr(1);
    const kr = toCamelCase(path);
    console.log(path, 'path', kr.split('.')[0]);
    keys[kr.split('.')[0]] = path;
  }
};

deepRead('');

fs.writeFileSync(
  srcJson,
  `${Object.keys(keys)
    .map(x => `export {default as ${x}} from '.${keys[x]}';`)
    .join('\n')}
`,
);

// console.log(keys, 'keys');
console.log('---- SUCCESS PACKAGE IMAGE SVG----');
