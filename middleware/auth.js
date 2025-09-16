const marketplace = require('../models/marketplace');

exports.isGuest = (req, res, next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;

    marketplace.findById(id)
    .then(listing => {
        if(listing){
            if(listing.sellerType == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.isNotAuthor = (req, res, next) => {
    let id = req.params.id;

    marketplace.findById(id)
    .then(listing => {
        if(listing){
            if(listing.sellerType != req.session.user){
                return next();
            } else {
                let err = new Error('You are the Author of the Listing');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a listing with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};