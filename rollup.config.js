/* eslint-env node */
import rollupPluginBabel from 'rollup-plugin-babel';
import packageJson from './package.json';

const { dependencies = {} } = packageJson;
const externals = Object.keys(dependencies);

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.js', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'es' },
  ],
  external: id => externals.some(dep => id === dep || id.startsWith(`${dep}/`)),
  onwarn(warning) {
    if (warning.code === 'UNRESOLVED_IMPORT') throw new Error(warning.message);
    // eslint-disable-next-line no-console
    console.warn(warning.message);
  },
  plugins: [
    'rollup',
    rollupPluginBabel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
  ],
};
