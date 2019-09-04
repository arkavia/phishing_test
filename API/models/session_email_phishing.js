const mongoose = require('mongoose');
const { Schema } = mongoose;

// ESTRUCTURA DOCUMENTO
const SessionPhishing = new Schema({
    ip4: { type: String, require: true },
    timestamp: { type: Date, required: true }
});

// REFERENCIA AL DOCUMENTO EN MONGO DB
module.exports = mongoose.model('api_phishing_users', SessionPhishing);