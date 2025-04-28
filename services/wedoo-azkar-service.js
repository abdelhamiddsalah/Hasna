const { validationResult } = require("express-validator");
const Azkar = require("../models/wedoo-azkar-model");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallwedooazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const wedooazkar = await Azkar.find();

    wedooazkar.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });

    if (!wedooazkar || wedooazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع كل الأذكار
    res.status(200).json({
        azkar: wedooazkar,
        totalAzkar: wedooazkar.length
    });
});

module.exports = {
    getallwedooazkarRoute
};
