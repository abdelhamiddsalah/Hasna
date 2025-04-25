const moment = require('moment-timezone');
const axios = require("axios");
const API_URL = "http://api.aladhan.com/v1/timingsByCity";

const getallprayerstimersRoute = async (req, res) => {
    try {
        const { city = "Cairo", country = "EG" } = req.query;

        const response = await axios.get(API_URL, {
            params: { city, country, method: 5 },
        });

        const timings = response.data.data.timings;
        const prayerTimes = {
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
        };

        // ✅ جلب التوقيت الفعلي في القاهرة
        const cairoTime = moment().tz("Africa/Cairo");
        const currentHour = cairoTime.hour();
        const currentMinute = cairoTime.minute();
        const currentTimeMinutes = currentHour * 60 + currentMinute;

        const convertToMinutes = (timeString) => {
            const [hour, minute] = timeString.split(":").map(Number);
            return hour * 60 + minute;
        };

        const prayers = [
            { name: "الفجر", time: convertToMinutes(prayerTimes.fajr) },
            { name: "الظهر", time: convertToMinutes(prayerTimes.dhuhr) },
            { name: "العصر", time: convertToMinutes(prayerTimes.asr) },
            { name: "المغرب", time: convertToMinutes(prayerTimes.maghrib) },
            { name: "العشاء", time: convertToMinutes(prayerTimes.isha) }
        ];

        let previousPrayer = { name: "لا توجد صلاة سابقة" };
        let nextPrayer = { name: "لا توجد صلاة قادمة" };

        if (currentTimeMinutes > prayers[4].time || currentTimeMinutes < prayers[0].time) {
            previousPrayer = { name: "العشاء" };
            nextPrayer = { name: "الفجر" };
        } else {
            for (let i = 0; i < prayers.length; i++) {
                if (currentTimeMinutes <= prayers[i].time) {
                    nextPrayer = { name: prayers[i].name };
                    previousPrayer = i > 0 ? { name: prayers[i - 1].name } : { name: "العشاء" };
                    break;
                }
            }
        }

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
