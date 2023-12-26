const propertyService = require('../services/propertyService');
const { listByCategory } = require("../services/propertyService");

class SiteController {
  //[GET]  /
  async home(req, res, next) {
    await propertyService
      .listLatest(6)
      .then((properties) => {
        res.render('home', { properties });
      })
      .catch(error => next(error));
  }



}

module.exports = new SiteController();
