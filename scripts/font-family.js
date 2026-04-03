const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, '../src/Resources/Fonts');
const outputFile = path.join(fontsDir, 'index.ts');

// Font weight and style mapping
const weightMap = {
  thin: '100',
  extralight: '200',
  ultralight: '200',
  light: '300',
  regular: '400',
  normal: '400',
  medium: '500',
  semibold: '600',
  demibold: '600',
  bold: '700',
  extrabold: '800',
  ultrabold: '800',
  black: '900',
  heavy: '900',
};

function toPascalCase(parts) {
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

function parseFontName(filename) {
  const name = filename.replace(/\.(ttf|otf)$/i, '');
  const parts = name.split(/[-_\s]+/);

  let weight = '400';
  let weightWord = '';
  for (const p of parts) {
    const part = p.toLowerCase();
    for (const [key, val] of Object.entries(weightMap)) {
      if (part.includes(key)) {
        weight = val;
        weightWord = key;
        break;
      }
    }
    if (weightWord) break;
  }

  const isItalic = parts.some((p) =>
    ['italic', 'oblique'].includes(p.toLowerCase())
  );

  const baseParts = parts.filter(
    (p) =>
      !Object.keys(weightMap).some((key) => p.toLowerCase().includes(key)) &&
      !['italic', 'oblique'].includes(p.toLowerCase())
  );

  const baseKey = toPascalCase(baseParts);
  const styleSuffix = isItalic ? 'Italic' : '';
  const descriptor = weightWord ? toPascalCase([weightWord]) : '';

  let key = `${baseKey}${weight}${styleSuffix}`;
  return { key, iosName: baseParts.join(' ') + (descriptor ? ` ${descriptor}` : '') + (isItalic ? ' Italic' : ''), androidName: name };
}

const files = fs.readdirSync(fontsDir);
const keyMap = {};

files
  .filter((f) => /\.(ttf|otf)$/i.test(f))
  .forEach((file) => {
    let { key, iosName, androidName } = parseFontName(file);

    // If key already exists, make it more specific with weight descriptor
    if (keyMap[key]) {
      key = key + 'Italic';
    }

    keyMap[key] = { ios: iosName.trim(), android: androidName };
  });

const output = `// This file is auto-generated. Do not edit manually.
import { Platform } from 'react-native';

export const Fonts = {
${Object.entries(keyMap)
  .map(
    ([key, { ios, android }]) =>
      `  ${key}: Platform.select({ ios: '${ios}', android: '${android}' })`
  )
  .join(',\n')}
};
`;

fs.writeFileSync(outputFile, output, 'utf-8');
console.log(`✅ Font index generated at: ${outputFile}`);
