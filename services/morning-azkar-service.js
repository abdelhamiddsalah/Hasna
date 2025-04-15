const { validationResult } = require("express-validator");
const Azkar = require("../models/morning-azkar");
const asyncHandler = require("express-async-handler");
const Apierror = require("../Utils/api-error");

const getallmorningazkarRoute = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new Apierror(errors.array()[0].msg, 400));
    }

    // جلب كل الأذكار من قاعدة البيانات
    const morningazkar = await Azkar.find();

    if (!morningazkar || morningazkar.length === 0) {
        return next(new Apierror("لا توجد أذكار متاحة!", 404));
    }

    // قراءة رقم الصفحة من الطلب (إذا لم يُحدد، تكون الصفحة 1)
    let page = parseInt(req.query.page) || 1;

    // التأكد أن الصفحة لا تتجاوز عدد الأذكار
    if (page > morningazkar.length) {
        page = 1; // إعادة التدوير للصفحة الأولى
    }

    // اختيار الذكر بناءً على رقم الصفحة (الترتيب من 1 إلى آخر ذكر)
    const zekr = morningazkar[page - 1];

    // إرجاع الذكر مع معلومات الصفحة
    res.status(200).json({
        zekr,
        currentPage: page,
        totalAzkar: morningazkar.length
    });
});

module.exports = {
    getallmorningazkarRoute
};
