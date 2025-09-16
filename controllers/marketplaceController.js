const model = require('../models/marketplace');
const offer = require('../models/offer');
const he = require('he');


exports.index = (req, res, next) => {
    let searchQuery = req.query.search;

    if(searchQuery){
        model.find({
            $and: [
                { active: true },
                {
                    $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } }
                    ]
                }
            ]
        })
        .then(vehicles => res.render('./marketplace/index', {vehicles, query: searchQuery}))
        .catch(err => next(err));

    }else{
        model.find({ active: true }).sort({ price : 'asc'})
        .then(vehicles => res.render('./marketplace/index', {vehicles, query: ''}))
        .catch(err => next(err));
    }
};


exports.new = (req, res) => {
    res.render('./marketplace/new');
};


exports.create = (req, res, next) => {
    let vehicle = new model(req.body);
    vehicle.sellerType = req.session.user;
    
    if(req.file && req.file.filename){
        vehicle.image = '/images/' + req.file.filename;
    }

    console.log(vehicle);

    vehicle.save()
    .then( vehicle => {
        req.flash('success', 'Your listing was created successfully');
        res.redirect('/market')
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        
        next(err);
    });    
};


exports.show = (req, res, next) => {
    let id = req.params.id;

    model.findById(id).populate('sellerType', 'firstName lastName')
    .then(vehicle => {
        if(vehicle) {
            vehicle.description = he.decode(vehicle.description);
            res.render('./marketplace/show', {vehicle});
        } else {
            let err = new Error('Cannot find a vehicle with ID ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};


exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(vehicle => {
        res.render('./marketplace/edit', {vehicle});
    })
    .catch(err => next(err));
};


exports.update = (req, res, next) => {
    let vehicle = req.body;
    let id = req.params.id;

    vehicle.image = vehicle.oldImage;
    if(req.file){
        vehicle.image = '/images/' + req.file.filename;
    }

    model.findByIdAndUpdate(id, vehicle, {runValidators: true})
    .then(vehicle => {
        req.flash('success', 'Item updated successfully');
        res.redirect('/market/' + id)
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });
};


exports.delete = (req, res, next) => {
    let id = req.params.id;

    Promise.all([
        model.findByIdAndDelete(id), 
        offer.deleteMany({ item: id })
    ])
    .then(([vehicle, result]) => {
        req.flash('success', 'Item deleted successfully');
        res.redirect('/market');
    })
    .catch(err => next(err));
};