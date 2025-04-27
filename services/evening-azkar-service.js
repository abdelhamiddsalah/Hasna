const { validationResult } = require("express-validator");
const Azkar = require("../models/evening-azkar");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getalleveningazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const eveningazkar = await Azkar.find();

    eveningazkar.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });

    if (!eveningazkar || eveningazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // إرجاع كل الأذكار
    res.status(200).json({
        azkar: eveningazkar,
        totalAzkar: eveningazkar.length
    });
});

module.exports = {
    getalleveningazkarRoute
};
