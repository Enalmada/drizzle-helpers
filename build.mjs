await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'node',
    external: ['drizzle-orm', 'postgres'],
    root: './src',
});

await Bun.build({
    entrypoints: ['./src/migrate/index.ts'],
    outdir: './dist',
    target: 'node',
    root: './src',
    naming: {
        entry: '[dir]/[name].mjs',
    },
