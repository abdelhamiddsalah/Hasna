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
        
        // تحويل الوقت الحالي إلى ساعات ودقائق فقط
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
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