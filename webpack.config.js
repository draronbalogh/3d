const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/back-end/config')
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.css', '.scss', '.json', '.xml']
  }
};
