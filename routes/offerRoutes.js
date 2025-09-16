const express = require('express');
const controller = require('../controllers/offerController');
const {isAuthor, isNotAuthor, isLoggedIn} = require('../middleware/auth');
const {validateOffer, validateResult}  = require('../middleware/validator');


const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, isNotAuthor, validateOffer, validateResult, controller.create);

router.get('/', isLoggedIn, isAuthor, controller.getOffers);

router.put('/:offerId', isLoggedIn, isAuthor, controller.acceptOffer);

module.exports = router;

