const path = require('path');

const tsc = () => `bun --bun tsc --noEmit`;

const buildEslintCommand = (filenames) =>
    `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
    '**/*.{ts,tsx,mjs,cjs}': [buildEslintCommand, tsc],
    'package.json': ['npm pkg fix', 'fixpack'],
};