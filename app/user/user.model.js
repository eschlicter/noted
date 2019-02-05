const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

//Mongoose schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.serialize = function () {
    return {
        id: this.id,
        name: this.name,
        email: this.email,
        username: this.username
    };
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
//To validate that data used to create a new user is valid, we will use "Joi", a NPM library that
// allows you to create "blueprints" or "schemas" to ensure validation of key information. To learn more:
// https://www.npmjs.com/package/joi
const UserJoiSchema = Joi.object().keys({
    // To learn more about Joi string validations, see:
    // https://github.com/hapijs/joi/blob/v13.6.0/API.md#string---inherits-from-any
    name: Joi.string().min(1).trim().required(),
    username: Joi.string().alphanum().min(4).max(30).trim().required(),
    password: Joi.string().min(8).max(30).trim().required(),
    email: Joi.string().email().trim().required()
});

const User = mongoose.model('user', userSchema);

module.exports = { User, UserJoiSchema };