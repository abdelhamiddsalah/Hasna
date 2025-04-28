const { validationResult } = require("express-validator");
const Azkar = require("../models/bathroom-azkar-model");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallbathroomazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const bathroomazkar = await Azkar.find();

    bathroomazkar.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });

    if (!bathroomazkar || bathroomazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع كل الأذكار
    res.status(200).json({
        azkar: bathroomazkar,
        totalAzkar: bathroomazkar.length
    });
});

module.exports = {
    getallbathroomazkarRoute
};
