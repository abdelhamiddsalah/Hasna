const mongoose = require('mongoose');

const azkarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    audioUrl: {
        type: String, // حفظ الرابط فقط
        required: false
    },
    esnadname: {
        type: String,
        required: true
    },
    thawapofzekr: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Azkar', azkarSchema);