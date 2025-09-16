const model = require('../models/user');
const marketplace = require('../models/marketplace');
const offer = require('../models/offer');

exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body);

    if(user.email){
        user.email = user.email.toLowerCase();
    }

    user.save()
    .then(() => {
        req.flash('success', 'Registration Succeeded');
        res.redirect('/users/login')
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/users/new');
        }

        if(err.code = 11000){
            req.flash('error', 'Email address already in use');
            return res.redirect('/users/new');
        }

        next(err);
    });
};

exports.show = (req, res)=>{
    res.render('./user/login');
};

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }

    let password = req.body.password;

    model.findOne({email: email})
    .then(user => {
        if(user){
            user.comparePassword(password)
            .then(result => {
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong password');
                    res.redirect('/users/login');
                }
            })
            .catch(err => next(err));
        } else {
            req.flash('error', 'Wrong email');
            res.redirect('/users/login');
        }
    })
    .catch( err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;

    Promise.all([model.findById(id), 
                marketplace.find({sellerType: id}), 
                offer.find({buyer: id}).populate('item')])
    .then(results => {
        const [user, listings, offers] = results;
        res.render('./user/profile', {user, listings, offers});
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err => {
        if(err){
            return next(err);
        }
        res.redirect('/');        
    });
};