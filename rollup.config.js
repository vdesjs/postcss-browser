import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import { nodeResolve } from '@rollup/plugin-node-resolve'

module.exports = {
  input: 'lib/postcss.js',
  output: [
    {
      file: 'dist/postcss.js',
      format: 'es'
    }
  ],
  plugins: [
    nodePolyfills(),
    nodeResolve({ preferBuiltins: false }),
    commonjs(),
    processPolyfill()
  ]
}

function processPolyfill() {
  return {
    name: 'process-polyfill',
    renderChunk(code, chunk, options) {
      console.log('renderChunk', options.file)
      code =
        `
      var process = {
        env: {

        }
      }\n` + code

      return code
    }
  }
}
