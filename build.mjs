await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'node',
  external: ['@urql/core', 'graphql'],
  root: './src',
});
