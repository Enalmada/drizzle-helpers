import { bunBuild, getSourceFiles } from '@enalmada/bun-externals';

async function buildWithExternals(): Promise<void> {
  const entrypoints = await getSourceFiles();

  await bunBuild({
    entrypoints,
    outdir: './dist',
    target: 'node',
    external: ['*'],
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
