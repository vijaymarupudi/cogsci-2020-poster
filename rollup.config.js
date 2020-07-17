import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    postcss()
  ],
  output: {
    file: 'build/bundle.js',
    format: 'iife'
  }
}
