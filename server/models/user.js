const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Schema allows us to add custom functions
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Define instance methods
// Not using arrow function because it doesn't 
// bind this
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    // Returning token allows promise to be chained
    // Then clause of who calls this will receive 
    // token in their success call.
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function () {
    return _.pick(this, ['_id', 'email']);
};

var User = mongoose.model('User', UserSchema);

// Create model this way for simple models
// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         minLength: 1,
//         trim: true,
//         unique: true,
//         validate: {
//             validator: (value) => {
//                 return validator.isEmail(value);
//             },
//             message: '{VALUE} is not a valid email'
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         minLength: 6
//     },
//     tokens: [{
//         access: {
//             type: String,
//             required: true
//         },
//         token: {
//             type: String,
//             required: true
//         }
//     }]
// })

module.exports = {
    User
}