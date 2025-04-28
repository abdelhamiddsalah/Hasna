// services/hadith-service.js

const { validationResult } = require("express-validator");
const Hadith = require("../models/hadith-model");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getTodayHadith = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأحاديث من قاعدة البيانات
    const allHadiths = await Hadith.find();

    if (!allHadiths || allHadiths.length === 0) {
        return next(new Apierror("لا توجد أحاديث متاحة!", 404));
    }

    // ترتيب الأحاديث لو كان لها id أو ترتيب خاص
    allHadiths.sort((a, b) => {
        return (a.id.toString()).localeCompare(b.id.toString());
    });

    // تحديد حديث اليوم بناءً على رقم اليوم في السنة
    const today = new Date();
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );

    // اختيار الحديث بناءً على اليوم مع الدوران لو خلصت الأحاديث
    const hadithIndex = dayOfYear % allHadiths.length;

    const todayHadith = allHadiths[hadithIndex];

    res.status(200).json({
        hadith: todayHadith,
        totalHadiths: allHadiths.length,
        dayOfYear: dayOfYear,
    });
});

module.exports = {
    getTodayHadith
};
