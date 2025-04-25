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
        const hijriDate = response.data.data.date.hijri;

        const prayerTimes = {
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
        };

        // ✅ الوقت الحالي في القاهرة
        const cairoTime = moment().tz("Africa/Cairo");
        const currentHour = cairoTime.hour();
        const currentMinute = cairoTime.minute();
        const currentTimeMinutes = currentHour * 60 + currentMinute;

        const convertToMinutes = (timeString) => {
            const [hour, minute] = timeString.split(":").map(Number);
            return hour * 60 + minute;
        };

        const prayers = [
            { name: "الفجر", time: convertToMinutes(prayerTimes.fajr), rawTime: prayerTimes.fajr },
            { name: "الظهر", time: convertToMinutes(prayerTimes.dhuhr), rawTime: prayerTimes.dhuhr },
            { name: "العصر", time: convertToMinutes(prayerTimes.asr), rawTime: prayerTimes.asr },
            { name: "المغرب", time: convertToMinutes(prayerTimes.maghrib), rawTime: prayerTimes.maghrib },
            { name: "العشاء", time: convertToMinutes(prayerTimes.isha), rawTime: prayerTimes.isha }
        ];

        let previousPrayer = { name: "لا توجد صلاة سابقة", time: null };
        let nextPrayer = { name: "لا توجد صلاة قادمة", time: null };

        if (currentTimeMinutes > prayers[4].time || currentTimeMinutes < prayers[0].time) {
            previousPrayer = { name: "العشاء", time: prayerTimes.isha };
            nextPrayer = { name: "الفجر", time: prayerTimes.fajr };
        } else {
            for (let i = 0; i < prayers.length; i++) {
                if (currentTimeMinutes <= prayers[i].time) {
                    nextPrayer = { name: prayers[i].name, time: prayers[i].rawTime };
                    previousPrayer = i > 0
                        ? { name: prayers[i - 1].name, time: prayers[i - 1].rawTime }
                        : { name: "العشاء", time: prayerTimes.isha };
                    break;
                }
            }
        }

        // ✅ التاريخ الهجري
        const hijri = {
            date: hijriDate.date, // eg: 16-09-1446
            weekday: hijriDate.weekday.ar, // eg: الأحد
            day: hijriDate.day, // eg: 16
            month: hijriDate.month.ar, // eg: رمضان
            year: hijriDate.year // eg: 1446
        };

        res.status(200).json({
            hijri,
            azkar: prayerTimes,
            previousPrayer,
            nextPrayer,
        });

    } catch (error) {
        console.error("Error fetching prayer times:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب مواقيت الصلاة" });
    }
};

module.exports = { getallprayerstimersRoute };
