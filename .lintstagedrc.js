import path from "node:path";

const tsc = () => "bun --bun tsc --noEmit";

const buildEslintCommand = (filenames) =>
	`eslint --fix ${filenames.map((f) => path.relative(process.cwd(), f)).join(" ")}`;

export default {
	"**/*.{js,jsx,ts,tsx,json,yaml,yml,md,css,scss}": () => "bun run lint",
	"**/*.{ts,tsx}": [tsc],
	// './package.json': ['npm pkg fix', 'fixpack'],
};
