const path = require('path')

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'compeon-jsonapi-serializer.js',
    library: 'compeon-jsonapi-serializer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  }
}
