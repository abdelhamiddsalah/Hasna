const axios = require("axios");
const API_URL = "http://api.aladhan.com/v1/timingsByCity";

const getallprayerstimersRoute = async (req, res) => {
    try {
        const { city = "Cairo", country = "EG" } = req.query;
        
        // جلب مواقيت الصلاة من API
        const response = await axios.get(API_URL, {
            params: { city, country, method: 5 },
        });
        
        // الحصول على مواعيد الصلاة من البيانات المستلمة
        const timings = response.data.data.timings;
        const prayerTimes = {
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
        };
        
        // الحصول على الوقت الحالي بتوقيت مصر (UTC+2)
        // للاختبار: استخدام وقت محدد (19:22)
        // في بيئة الإنتاج: استخدم كود الوقت الفعلي بتوقيت مصر
        
        // للاختبار (الساعة 19:22):
        const currentHour = 19;
        const currentMinute = 22;
        
        /* في بيئة الإنتاج، استخدم هذا الكود للحصول على الوقت بتوقيت مصر:
        const now = new Date();
        // تحويل الوقت إلى توقيت مصر (UTC+2)
        const cairoTime = new Date(now.getTime() + (2 * 60 + now.getTimezoneOffset()) * 60000);
        const currentHour = cairoTime.getHours();
        const currentMinute = cairoTime.getMinutes();
        */
        
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        
        // تحويل وقت الصلاة إلى دقائق منذ منتصف الليل للمقارنة
        const convertToMinutes = (timeString) => {
            const [hour, minute] = timeString.split(":").map(Number);
            return hour * 60 + minute;
        };
        
        // تحويل مواعيد الصلاة إلى دقائق
        const prayers = [
            { name: "الفجر", time: convertToMinutes(prayerTimes.fajr) },
            { name: "الظهر", time: convertToMinutes(prayerTimes.dhuhr) },
            { name: "العصر", time: convertToMinutes(prayerTimes.asr) },
            { name: "المغرب", time: convertToMinutes(prayerTimes.maghrib) },
            { name: "العشاء", time: convertToMinutes(prayerTimes.isha) }
        ];
        
        let previousPrayer = { name: "لا توجد صلاة سابقة" };
        let nextPrayer = { name: "لا توجد صلاة قادمة" };
        
        // حالة خاصة: إذا كان الوقت بعد العشاء وقبل الفجر
        if (currentTimeMinutes > prayers[4].time || currentTimeMinutes < prayers[0].time) {
            previousPrayer = { name: "العشاء" };
            nextPrayer = { name: "الفجر" };
        } else {
            // البحث عن الصلاة السابقة والقادمة
            for (let i = 0; i < prayers.length; i++) {
                if (currentTimeMinutes < prayers[i].time) {
                    // الصلاة القادمة هي التي لم يحن وقتها بعد
                    nextPrayer = { name: prayers[i].name };
                    
                    // الصلاة السابقة هي السابقة للصلاة القادمة، إلا إذا كانت القادمة هي الفجر
                    if (i > 0) {
                        previousPrayer = { name: prayers[i-1].name };
                    } else {
                        previousPrayer = { name: "العشاء" }; // إذا كانت القادمة هي الفجر، فالسابقة هي العشاء (من اليوم السابق)
                    }
                    break;
                }
            }
            
            // إذا تجاوزنا كل الصلوات، فإن الصلاة السابقة هي آخر صلاة وهي العشاء
            if (nextPrayer.name === "لا توجد صلاة قادمة") {
                previousPrayer = { name: prayers[prayers.length - 1].name };
                nextPrayer = { name: prayers[0].name }; // والقادمة هي الفجر (من اليوم التالي)
            }
        }
        
        // إضافة طباعة للتشخيص
        console.log(`الوقت الحالي: ${currentHour}:${currentMinute}`);
        console.log(`مواقيت الصلاة: `, prayerTimes);
        console.log(`الصلاة السابقة: ${previousPrayer.name}`);
        console.log(`الصلاة القادمة: ${nextPrayer.name}`);
        
        // إرسال البيانات إلى العميل
        res.status(200).json({
            azkar: prayerTimes,
            previousPrayer: previousPrayer.name,
            nextPrayer: nextPrayer.name,
        });
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب مواقيت الصلاة" });
    }
};

module.exports = { getallprayerstimersRoute };