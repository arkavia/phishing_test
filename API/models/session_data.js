const mongoose = require('mongoose');
const { Schema } = mongoose;

// ESTRUCTURA DOCUMENTO
const SessionData = new Schema({
    ip4: { type: String, require: true},
    emails: { type: Array, require: true}
});

// REFERENCIA AL DOCUMENTO EN MONGO DB
module.exports = mongoose.model('user_session', SessionData);