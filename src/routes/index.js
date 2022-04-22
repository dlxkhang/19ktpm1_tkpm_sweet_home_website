const siteRouter = require('./site');
function route(app) {
//nothing here
  app.use('/', siteRouter);
}

module.exports = route;
