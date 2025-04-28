// routes/hadith-route.js

const express = require('express');
const router = express.Router();

const { getTodayHadith } = require('../services/hadith-service');

// Route لعرض حديث اليوم
router.get('/', getTodayHadith);

module.exports = router;
