const nodeResolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');

const plugins = [];

plugins.push(nodeResolve());
plugins.push(replace({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
}));
plugins.push(babel({
  plugins: ['@babel/plugin-syntax-dynamic-import'],
  env: {
    production: {
      presets: ['minify'],
    },
  },
}));


export default {
  input: 'js/main.js',
  plugins,

  output: {
    format: 'esm',
    sourcemap: true,
    dir: '.www/js',
  },

  experimentalCodeSplitting: true,
};
