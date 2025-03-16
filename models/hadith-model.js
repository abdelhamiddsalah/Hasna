const mongoose = require("mongoose");

const hadithSchema = new mongoose.Schema({
  text: { type: String, required: true }, // نص الحديث
  explanation: { type: String, required: true }, // تفسير الحديث
  source: { type: String, required: true }, // مصدر الحديث (البخاري، مسلم، إلخ)
  dateAdded: { type: Date, default: Date.now }, // تاريخ الإدراج
});

const Hadith = mongoose.model("Hadith", hadithSchema);

module.exports = Hadith;
