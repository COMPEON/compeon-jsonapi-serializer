import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/compeon-jsonapi-serializer.umd.js',
      name: 'jsonapi-serializer',
      format: 'umd',
      globals: {
        lodash: 'lodash'
      }
    },
    {
      file: 'dist/compeon-jsonapi-serializer.es.js',
      name: 'jsonapi-serializer',
      format: 'es',
      globals: {
        lodash: 'lodash'
      }
    }
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-proposal-object-rest-spread'],
      presets: [['@babel/env', { modules: false }]]
    })
  ],
  external: ['lodash']
}
