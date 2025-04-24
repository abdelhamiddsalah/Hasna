const { validationResult } = require("express-validator");
const Azkar = require("../models/after-pray-model");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallafterprayazkar = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const afterprayazkar = await Azkar.find();

    if (!afterprayazkar || afterprayazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع كل الأذكار
    res.status(200).json({
        azkar: afterprayazkar,
        totalAzkar: afterprayazkar.length
    });
});

module.exports = {
    getallafterprayazkar
};
