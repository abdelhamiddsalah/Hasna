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

        // دالة لتحويل الوقت إلى 24 ساعة (للمقارنة)
        const convertTo24Hour = (timeString) => {
            const [hour, minute] = timeString.split(":");
            return new Date(1970, 0, 1, hour, minute); // نعود إلى تاريخ ثابت مع الوقت المحدد
        };

        // تحديد الوقت الحالي
        const currentTime = new Date();

        // تحويل مواعيد الصلاة إلى كائنات تاريخية
        const timesArray = [
            { name: "الفجر", time: convertTo24Hour(prayerTimes.fajr) },
            { name: "الظهر", time: convertTo24Hour(prayerTimes.dhuhr) },
            { name: "العصر", time: convertTo24Hour(prayerTimes.asr) },
            { name: "المغرب", time: convertTo24Hour(prayerTimes.maghrib) },
            { name: "العشاء", time: convertTo24Hour(prayerTimes.isha) },
        ];

        let previousPrayer = null;
        let nextPrayer = null;

        // تحديد الصلاة السابقة والقادمة بناءً على الوقت الحالي
        for (let i = 0; i < timesArray.length; i++) {
            const currentPrayer = timesArray[i];
            if (currentTime < currentPrayer.time) {
                nextPrayer = currentPrayer;
                if (i > 0) {
                    previousPrayer = timesArray[i - 1];
                }
                break;
            }
        }

        // التحقق إذا كان الوقت بين المغرب والعشاء
        if (currentTime >= timesArray[3].time && currentTime < timesArray[4].time) {
            previousPrayer = { name: "المغرب" }; // الصلاة السابقة هي المغرب
            nextPrayer = { name: "العشاء" }; // الصلاة القادمة هي العشاء
        }

        // التحقق إذا كان الوقت بين العصر والمغرب
        if (currentTime >= timesArray[2].time && currentTime < timesArray[3].time) {
            previousPrayer = { name: "العصر" }; // الصلاة السابقة هي العصر
            nextPrayer = { name: "المغرب" }; // الصلاة القادمة هي المغرب
        }

        // التحقق إذا كان الوقت بين الفجر والظهر
        if (currentTime >= timesArray[0].time && currentTime < timesArray[1].time) {
            previousPrayer = { name: "الفجر" }; // الصلاة السابقة هي الفجر
            nextPrayer = { name: "الظهر" }; // الصلاة القادمة هي الظهر
        }

        // التحقق إذا كان الوقت بين الظهر والعصر
        if (currentTime >= timesArray[1].time && currentTime < timesArray[2].time) {
            previousPrayer = { name: "الظهر" }; // الصلاة السابقة هي الظهر
            nextPrayer = { name: "العصر" }; // الصلاة القادمة هي العصر
        }

        // إذا كانت الصلاة القادمة بعد أذان الفجر
        if (!nextPrayer) {
            nextPrayer = timesArray[0];
        }

        // إرسال البيانات إلى العميل
        res.status(200).json({
            azkar: prayerTimes,
            previousPrayer: previousPrayer ? previousPrayer.name : "لا توجد صلاة سابقة",
            nextPrayer: nextPrayer ? nextPrayer.name : "لا توجد صلاة قادمة",
        });

    } catch (error) {
        console.error("Error fetching prayer times:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب مواقيت الصلاة" });
    }
};

module.exports = { getallprayerstimersRoute };
