const { validationResult } = require("express-validator");
const Azkar = require("../models/prayers-model");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallprayers = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب الأذكار وترتيبها حسب id
    const prayers = await Azkar.find();

    if (!prayers || prayers.length === 0) {
        return next(new Apierror("لا توجد أدعيه متاحة!", 404));
    }

    res.status(200).json({
        azkar: prayers,
        totalAzkar: prayers.length
    });
});

module.exports = {
    getallprayers
};
