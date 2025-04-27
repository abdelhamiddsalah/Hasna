const mongoose = require("mongoose");

const beforeSleepSchema = new mongoose.Schema({
    id:{
        type: Number,
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
    description:{
    type: String,
    required:  false
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
    },
});


module.exports =  mongoose.model("BeforeSleep", beforeSleepSchema,"BeforeSleep")
    