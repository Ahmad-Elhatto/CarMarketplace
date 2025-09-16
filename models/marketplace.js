const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    price: {type: Number, required: [true, 'price is required'],
            min: .01},
    mileage: {type: Number, required: [true, 'mileage is required'],
              min: 0},
    description: {type: String, required: [true, 'description is required'],
                  minLength: [10, 'the description needs to be 10 characters long or longer']},
    vehicleType: {type: String, required: [true, 'vehicleType is required'],
                  enum: ['SUV', 'Sedan', 'Truck', 'Coupe', 'Convertible', 'Motorcycle', 'Van']},
    year: {type: Number, required: [true, 'year is required'],
           min: 1800},
    sellerType: {type: Schema.Types.ObjectId, ref:'User'},
    image: {type: String, required: [true, 'image is required']},
    active: {type: Boolean, required: [true, 'active is required'], default: true},
    totalOffers: {type: Number, default: 0},
    highestOffer:{type: Number, default: 0}
},{
    timestamps: true
});

//collection name is Vehicles in the database
module.exports = mongoose.model('Vehicle', marketSchema);