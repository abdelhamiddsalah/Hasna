const mongoose = require('mongoose');

const prayersSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    souraname: {
        type: String,
        required: false
    },
     audioUrl: {
        type: String, // حفظ الرابط فقط
        required: false
    },
});

module.exports = mongoose.model('prayers', prayersSchema, 'prayers');
