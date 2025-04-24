const mongoose = require('mongoose');

const aftarpraySchema = new mongoose.Schema({
    id:{
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    count: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    audioUrl: {
        type: String, // حفظ الرابط فقط
        required: false
    },
    esnadname: {
        type: String,
        required: false
    },
    thawapofzekr: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('afterprayAzkar', aftarpraySchema, 'afterprayAzkar');