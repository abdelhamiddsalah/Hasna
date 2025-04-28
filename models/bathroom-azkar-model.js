const mongoose = require('mongoose');

const bathroomAzkarSchema = new mongoose.Schema({
    id:{
        type: Number,
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
    audioUrl: {
        type: String, // حفظ الرابط فقط
        required: false
    },
    esnadname: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('bathroomAzkar', bathroomAzkarSchema, 'bathroomAzkar');