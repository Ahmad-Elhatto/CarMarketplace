const {body, query} = require('express-validator');
const {validationResult} = require('express-validator');


const isGreaterThanZero = (value) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      throw new Error('Value must be greater than 0.');
    }
    return true;
};

const isImageUploaded = (value, { req }) => {
    if (!req.file) {
      throw new Error('Image file is required.');
    }
    return true;
};

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\\

exports.validateId = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    return next()
};

exports.validateSignUp = [
    body('firstName', 'first name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'password must be between 8 and 64 characters long').isLength({min: 8, max:64})
];

exports.validateLogIn = [
    body('email', 'email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'password must be between 8 and 64 characters long').isLength({min: 8, max:64})
];

exports.validateSearch = [
    query('search').trim().escape()
];

exports.validateListing = [
    body('title', 'title cannot be empty').notEmpty().trim().escape(),
    body('price', 'Invalid currency format').isCurrency({allow_negatives: false}).custom(isGreaterThanZero).trim().escape(),
    body('mileage', 'Mileage must be an integer greater than 0').isInt({gt: 0}).trim().escape(),
    body('description', 'Desc must be longer than 10 characters').isLength({min: 10}).trim().escape(),
    body('vehicleType', 'Invalid vehicle type').isIn(['SUV', 'Sedan', 'Truck', 'Coupe', 'Convertible', 'Motorcycle', 'Van']),
    body('year', 'Year must be 4 characters longer and greater than 1800').isLength({min: 4, max:4}).isInt({gt: 1800}).trim().escape()
];

exports.validateImage = [
    body('image').custom(isImageUploaded)
];

exports.validateOffer = [
    body('amount', 'Invalid currency format').isCurrency({allow_negatives: false}).custom(isGreaterThanZero).trim().escape(),
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg); 
        });
        return res.redirect('back')
    } else {
        return next();
    }
};