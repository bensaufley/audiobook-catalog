/* eslint-disable import/no-extraneous-dependencies */

import { build } from 'esbuild';
import aliasPath from 'esbuild-plugin-alias-path';
import { chmod, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { rimraf } from 'rimraf';

import tsconfig from '../../tsconfig.json' with { type: 'json' };

const dirname = import.meta.dirname ?? __dirname;

const buildDir = resolve(dirname, '../../.build/bin');
if (!buildDir.endsWith('.build/bin')) {
  throw new Error('Error resolving build directory');
} else if ((await stat(buildDir)).isDirectory()) {
  await rimraf(`${buildDir}/*`, { glob: true });
}

const tree = (dir: string): Promise<readonly [string, string][]> =>
  readdir(dir).then((files) =>
    Promise.all(
      files.map(async (file) => {
        const path = resolve(dir, file);
        const stats = await stat(path);

        if (stats.isDirectory()) tree(path);
        if (!/\.[jt]sx?$/.test(extname(file))) return [];
        return [[basename(file, extname(file)), `${dir}/${file}`] as [string, string]];
      }),
    ).then((f) => f.flat()),
  );

const entryPoints = Object.fromEntries(await tree(resolve(dirname, '../../src/bin')));

if (Object.values(tsconfig.compilerOptions.paths).some((path) => path.length !== 1)) {
  throw new Error('Error resolving paths: cannot have more than one path per alias');
}

const nodeVersion = (await readFile(resolve(dirname, '../../.node-version'), 'utf-8')).trim();

await build({
  entryPoints,
  bundle: true,
  format: 'esm',
  outdir: resolve(dirname, '../../.build/bin'),
  packages: 'external',
  platform: 'node',
  target: `node${nodeVersion}`,
  plugins: [
    aliasPath({
      alias: Object.fromEntries(
        Object.entries(tsconfig.compilerOptions.paths).map(([alias, target]) => [
          alias,
          resolve(dirname, '../../', target[0].replace(/\/\*$/, '')),
        ]),
      ),
    }),
  ],
});

await Promise.all(
  Object.keys(entryPoints).map(async (file) => {
    const fullPath = resolve(dirname, '../../.build/bin', `${file}.js`);
    const contents = await readFile(fullPath, 'utf-8');
    const execPath = fullPath.substring(0, fullPath.length - 3);
    await writeFile(execPath, `#!/usr/bin/env node\n\n${contents}`, 'utf-8');
    await chmod(execPath, 0o755);
    await rm(fullPath);
  }),
);
