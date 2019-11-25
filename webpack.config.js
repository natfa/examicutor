const path = require('path');

module.exports = {
  target: 'node',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.ts'],
    mainFiles: ['index'],
  },
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /(node_modules|.git|bin)/,
        use: [
          'babel-loader',
        ],
      },
    ],
  },
};
