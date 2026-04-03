const fs = require('fs');

const src = '../src/Assets';
const __dir = '../src/Components/AppImage/';
const srcType = __dir + 'source/_type.ts';
const srcJson = __dir + 'source/paths.ts';
const srcDevFile = __dir + 'source/images.ts';

const keys = {};

const deepRead = path => {
  if (fs.lstatSync(src + path).isDirectory()) {
    for (let p of fs.readdirSync(src + path)) {
      if (p[0] == '.') continue;
      deepRead(path + '/' + p);
    }
  } else {
    const kr = path.replaceAll('/', '_').replaceAll('-', '_').substr(1);
    console.log(path, 'path', kr.split('.')[0]);
    keys[kr.split('.')[0]] = path;
  }
};

deepRead('');

fs.writeFileSync(
  srcJson,
  `export default {
  ${Object.keys(keys)
    .map(x => `${x}: 'assets${keys[x]}'`)
    .join(',\n  ')}
}`,
);

fs.writeFileSync(
  srcDevFile,
  `export default {
  ${Object.keys(keys)
    .map(x => `${x}: require('@/Assets${keys[x]}')`)
    .join(',\n  ')}
};
    `,
);

fs.writeFileSync(
  srcType,
  `export type LazyImageType = {
  ${Object.keys(keys)
    .map(
      x => `${x}: any,
  `,
    )
    .join('')}};
      `,
);

// console.log(keys, 'keys');
console.log('---- SUCCESS PACKAGE IMAGE----');
