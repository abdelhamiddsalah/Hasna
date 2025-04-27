const { validationResult } = require("express-validator");
const Azkar = require("../models/before-sleep");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallbeforesleepRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const beforesleepazkar = await Azkar.find();
    // ترتيب الأذكار حسب id كأرقام
    beforesleepazkar.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });

    if (!beforesleepazkar || beforesleepazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع كل الأذكار
    res.status(200).json({
        azkar: beforesleepazkar,
        totalAzkar: beforesleepazkar.length
    });
});

module.exports = {
    getallbeforesleepRoute
};
