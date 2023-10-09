import path from 'path';

const tsc = () => `bun --bun tsc --noEmit`;

const buildEslintCommand = (filenames) =>
    `eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')}`;

export default {
    '**/*.{ts,tsx,mjs,cjs}': [buildEslintCommand, tsc],
    'package.json': ['npm pkg fix', 'fixpack'],
};