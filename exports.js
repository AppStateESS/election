exports.path = require('path')
exports.APP_DIR = exports.path.resolve(__dirname, 'javascript')

exports.entry = {
  election: exports.APP_DIR + '/Admin/Election/Election.jsx',
  list: exports.APP_DIR + '/Admin/List/List.jsx',
  user: exports.APP_DIR + '/User/Election.jsx',
  vendor: ['react', 'react-dom']
}
