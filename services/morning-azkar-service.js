const { validationResult } = require("express-validator");
const Azkar = require("../models/morning-azkar");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallmorningazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }
    
    // جلب الأذكار وترتيبها حسب id كأرقام
    const morningazkar = await Azkar.find();
    
    // ترتيب النتائج رقمياً حسب الـ id
    morningazkar.sort((a, b) => {
        return Number(a.id) - Number(b.id);
    });
    
    if (!morningazkar || morningazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }
    
    res.status(200).json({
        azkar: morningazkar,
        totalAzkar: morningazkar.length
    });
});

module.exports = {
    getallmorningazkarRoute
};
