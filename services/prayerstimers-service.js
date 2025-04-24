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
            sunrise: timings.Sunrise,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
        };

        // تحديد الوقت الحالي
        const currentTime = new Date();
        const currentTimeString = currentTime.toISOString().slice(0, 19).replace("T", " ");

        // دالة لتحويل الوقت إلى 24 ساعة
        const convertTo24Hour = (timeString) => {
            const [hour, minute] = timeString.split(":");
            const amPm = timeString.includes("PM") ? 12 : 0;
            return parseInt(hour) + amPm;
        };

        // تحديد الصلاة السابقة والقادمة
        const timesArray = [
            { name: "fajr", time: convertTo24Hour(prayerTimes.fajr) },
            { name: "sunrise", time: convertTo24Hour(prayerTimes.sunrise) },
            { name: "dhuhr", time: convertTo24Hour(prayerTimes.dhuhr) },
            { name: "asr", time: convertTo24Hour(prayerTimes.asr) },
            { name: "maghrib", time: convertTo24Hour(prayerTimes.maghrib) },
            { name: "isha", time: convertTo24Hour(prayerTimes.isha) },
        ];

        // العثور على الصلاة السابقة والقادمة
        let previousPrayer = null;
        let nextPrayer = null;

        for (let i = 0; i < timesArray.length; i++) {
            const currentPrayer = timesArray[i];
            if (currentTime < new Date(prayerTimes[currentPrayer.name])) {
                nextPrayer = currentPrayer;
                if (i > 0) {
                    previousPrayer = timesArray[i - 1];
                }
                break;
            }
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
