// https://dev.to/thejaredwilcurt/improving-vitest-performance-42c6#:~:text=Turning%20isolation%20off%20(%20%2D%2Dno,cause%20issues%20in%20watch%20mode.
import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [],
	test: {
		exclude: [...configDefaults.exclude],
		watch: false,
		globals: true,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
