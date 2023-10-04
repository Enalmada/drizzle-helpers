await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  external: [], // Add dependencies here
  root: './src',
});
