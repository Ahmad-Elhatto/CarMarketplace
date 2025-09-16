const express = require('express');
const controller = require('../controllers/marketplaceController');
const { upload } = require('../middleware/fileupload');
const {isAuthor, isLoggedIn} = require('../middleware/auth');
const {validateId, validateSearch, validateListing, validateImage, validateResult}  = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');


const router = express.Router();

// GET /market: Sends all the available vehicles to the user

router.get('/', validateSearch, controller.index);

// GET /market/new: Sends HTML form for creating a new listing

router.get('/new', isLoggedIn, controller.new);

// POST /market: Create a new vehicle listing

router.post('/', isLoggedIn, upload, validateListing, validateImage, validateResult, controller.create);

// GET /market/:id: Send details of vehicle identifies by ID

router.get('/:id', validateId, controller.show);

// GET /market/:id/edit: Send the HTML form to edit a specific vehicle

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);

// PUT /market/:id: Update the vehicle identified by ID

router.put('/:id', validateId, isLoggedIn, isAuthor, upload, validateListing, validateResult, controller.update);

// DELETE /market/:id: Delete the vehicle identified by ID

router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

// 

router.use('/:id/offers', offerRoutes);

// Export Functionality

module.exports = router;