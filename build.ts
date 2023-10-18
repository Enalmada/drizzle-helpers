/// <reference types="bun-types" />

import getExternalDependencies, { bunBuild } from '@enalmada/bun-externals';

async function buildWithExternals(): Promise<void> {
  const externalDeps = await getExternalDependencies();

  await bunBuild({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    target: 'node',
    external: externalDeps,
    root: './src',
  });

  await bunBuild({
    entrypoints: ['./src/migrate/index.ts'],
    outdir: './dist',
    target: 'node',
    // We do want to bundle these
    // external: externalDeps,
    root: './src',
    naming: {
      entry: '[dir]/[name].mjs',
    },
  });
}

void buildWithExternals();
