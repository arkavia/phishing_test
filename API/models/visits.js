const mongoose = require('mongoose');
const { Schema } = mongoose;

// ESTRUCTURA DOCUMENTO
const Visits = new Schema({
    visits: { type: Number, required: true }
});

// REFERENCIA AL DOCUMENTO EN MONGO DB
module.exports = mongoose.model('visitors', Visits);