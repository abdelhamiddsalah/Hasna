const axios = require("axios");

const API_URL = "https://api.aladhan.com/v1/timingsByCity"; // ← استخدم https

const getallprayerstimersRoute = async (req, res) => {
    try {
        const { city = "Cairo", country = "EG" } = req.query;

        const response = await axios.get(API_URL, {
            params: { city, country, method: 5 },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching prayer times:", error.message);
        res.status(500).json({ error: "حدث خطأ أثناء جلب مواقيت الصلاة" });
    }
};

module.exports = { getallprayerstimersRoute };
