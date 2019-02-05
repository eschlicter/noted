const mongoose = require('mongoose');
const Joi = require('joi');

const noteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createDate: { type: Date },
    updateDate: { type: Date, default: Date.now }
});

noteSchema.methods.serialize = function () {
    let user;
    // We serialize the user if it's populated to avoid returning any sensitive information, like the password hash.
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        title: this.title,
        content: this.content,
        createDate: this.createDate,
        updateDate: this.updateDate
    };
};

const NoteJoiSchema = Joi.object().keys({

    user: Joi.string().optional(),
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    createDate: Joi.date().timestamp()
});


const Note = mongoose.model('note', noteSchema);

module.exports = { Note, NoteJoiSchema };