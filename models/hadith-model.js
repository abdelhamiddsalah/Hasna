// models/hadith-model.js

const mongoose = require('mongoose');

const hadithSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false,
        unique: true
    },
    hadith: {
        type: String,
        required: false
    },
    importance: {
        type: String,
        required: false
    },
    fiqh: {
        type: String,
        required: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Hadith', hadithSchema,"Hadith");


