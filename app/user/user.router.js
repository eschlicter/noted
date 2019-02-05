const express = require('express');
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { User, UserJoiSchema } = require('./user.model.js');

const userRouter = express.Router();

// create new user
userRouter.post('/', (request, response) => {
    const newUser = {
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    };

    // Validate new user information is correct.
    const validation = Joi.validate(newUser, UserJoiSchema);
    if (validation.error) {
        //If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Verify if the new user's email or username doesn't already exist in the database using Mongoose.Model.findOne()
    User.findOne({
        $or: [
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then(user => {
        if (user) {
            return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Database Error: A user with that username and/or email already exists.' });
        }
        return User.hashPassword(newUser.password);
    }).then(passwordHash => {
        newUser.password = passwordHash;

        User.create(newUser)
            .then(createdUser => {

                return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
            })
            .catch(error => {

                console.error(error);
                return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error.message
                });
            });
    });
});

// // retreive users
// userRouter.get('/', (request, response) => {
//     // Step 1: Attempt to retrieve all users from the database using Mongoose.Model.find()
//     // https://mongoosejs.com/docs/api.html#model_Model.find
//     User.find()
//         .then(users => {
//             // Step 2A: Return the correct HTTP status code, and the users correctly formatted via serialization.
//             return response.status(HTTP_STATUS_CODES.OK).json(
//                 users.map(user => user.serialize())
//             );
//         })
//         .catch(error => {
//             // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
//             return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
//         });
// });
// // RETRIEVE ONE USER
// userRouter.get('/:userid', (request, response) => {
//     // Step 1: Attempt to retrieve a specific user using Mongoose.Model.findById()
//     // https://mongoosejs.com/docs/api.html#model_Model.findById
//     User.findById(request.params.userid)
//         .then(user => {
//             // Step 2A: Return the correct HTTP status code, and the user correctly formatted via serialization.
//             return response.status(HTTP_STATUS_CODES.OK).json(user.serialize());
//         })
//         .catch(error => {
//             // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
//             return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
//         });
// });

module.exports = { userRouter };