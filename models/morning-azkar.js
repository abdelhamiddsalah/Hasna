const mongoose = require('mongoose');

const morningazkarschema = new mongoose.Schema({
    id:{
        type: int,
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

module.exports = mongoose.model('morningAzkar', morningazkarschema, 'morningAzkar');