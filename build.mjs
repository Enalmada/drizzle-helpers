import dts from 'bun-plugin-dts'

await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'node',
    external: ['drizzle-orm', 'postgres'],
    root: './src',
    plugins: [dts()]
});

await Bun.build({
    entrypoints: ['./src/migrate/index.ts'],
    outdir: './dist',
    target: 'node',
    root: './src',
    naming: {
        entry: '[dir]/[name].mjs',
    },
    plugins: [dts()]
});