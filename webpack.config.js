const path = require('path');

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/back-end/config')
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.css', '.scss', '.json', '.xml']
  }
};
