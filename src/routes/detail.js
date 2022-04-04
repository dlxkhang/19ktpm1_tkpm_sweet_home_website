const express = require('express');
const router = express.Router();
const propertyController = require('../app/controllers/PropertyController');

router.post('/:slug/request-tour', propertyController.requestTour);
router.get('/:slug', propertyController.show);
router.post('/favourite/add',propertyController.addPropertyToFavourite);
router.post('/favourite/remove',propertyController.removePropertyToFavourite);

module.exports = router;
