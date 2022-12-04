const path = require('path');

module.exports = {
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components')
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.css', '.scss', '.json', '.xml']
  }
};
