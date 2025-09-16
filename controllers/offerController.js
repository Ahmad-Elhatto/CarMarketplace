const model = require('../models/offer');
const marketplace = require('../models/marketplace');

exports.create = (req, res, next)=>{
    let offer = new model(req.body);
    let id = req.params.id;

    offer.buyer = req.session.user;
    offer.item = id;

    offer.save()
        .then(() => {
            marketplace.updateOne(
                { _id: id },
                {
                    $inc: { totalOffers: 1 },
                    $max: { highestOffer: offer.amount }
                }
            )
            .then(result => {
                req.flash('success', 'Offer Created Successfully');
                res.redirect('/market/' + id);
            })
            .catch(err => {
                next(err);
            });
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/market/' + id);
            }

            next(err);
        });
};

exports.getOffers = (req, res, next)=>{ 
    let id = req.params.id;

    model.find({item: id}).populate('buyer').populate('item')
    .then(offers => {
        if(offers) {
            res.render('./offer/offers', { offers });
        } else {
            let err = new Error('Cannot find a vehicle with ID ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}

exports.acceptOffer = (req, res, next)=>{ 
    let id = req.params.id;
    let offerId = req.params.offerId;

    Promise.all([marketplace.updateOne({_id: id}, { $set : { active: false }}),
                model.updateOne({ _id: offerId }, { $set: { status: 'accepted' }}),
                model.updateMany({ item: id, _id: { $ne: offerId } }, { $set: { status: 'rejected' }})])
    .then(result => {
        res.redirect('back');
    })
    .catch(err => next(err));
}