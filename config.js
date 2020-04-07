const path = require('path');

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  dbUrl: 'mongodb://localhost/hws',
  mongoOptions: {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  facebook: {
    appId: '622777065237173',
    appSecret: 'b109da92be1a6712f2e9661bb334409f'
  }
};
