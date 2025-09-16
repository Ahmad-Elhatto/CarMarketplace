const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'Cannot be empty']},
    lastName: {type: String, required: [true, 'Cannot be empty']},
    email: {type: String, required: [true, 'Cannot be empty'], unique: true},
    password: {type: String, required: [true, 'Cannot be empty']}
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')){
        return next();
    } else {
        bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err))
    }
});

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

//collection name is Users in the database
module.exports = mongoose.model('User', userSchema);