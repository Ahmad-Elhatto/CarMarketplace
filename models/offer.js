const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, 'offer amount is required'],
            min: .01},
    status: {type: String, required: [true, 'vehicleType is required'],
             enum: ['pending', 'rejected', 'accepted'],
             default: 'pending'},
    item: {type: Schema.Types.ObjectId, ref:'Vehicle'},
    buyer: {type: Schema.Types.ObjectId, ref:'User'} 
});

//collection name is Offers in the database
module.exports = mongoose.model('Offer', offerSchema);