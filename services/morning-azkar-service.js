const { validationResult } = require("express-validator");
const Azkar = require("../models/morning-azkar");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallmorningazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات دفعة واحدة
    const morningazkar = await Azkar.find();

    if (!morningazkar || morningazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع جميع الأذكار مع العدد الكلي للأذكار
    res.status(200).json({
        azkar: morningazkar,  // إرسال جميع الأذكار
        totalAzkar: morningazkar.length // إرسال العدد الكلي للأذكار
    });
});

module.exports = {
    getallmorningazkarRoute
};
