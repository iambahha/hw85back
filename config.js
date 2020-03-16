const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public', 'uploads'),
  database: 'mongodb://localhost/hw83',
  databaseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
};