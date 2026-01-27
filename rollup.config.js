import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json' assert { type: 'json' };

// 外部依赖，不打包进最终文件
const external = [
  'webpack',
  'webpack-sources',
  'path',
  'fs',
  'util',
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {})
];

export default defineConfig([
  // CommonJS 版本（用于 Node.js）
  {
    input: 'src/index.js',
    external,
    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', { targets: { node: '10' } }]]
      }),
      terser()
    ]
  },
  
  // ES Module 版本（现代打包工具使用）
  {
    input: 'src/index.js',
    external,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', { targets: { esmodules: true } }]]
      }),
      terser()
    ]
  },
  
  // UMD 版本（浏览器直接使用）
  {
    input: 'src/index.js',
    external: ['webpack'],
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'CssChunkMergePlugin',
      globals: {
        webpack: 'webpack'
      },
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
]);