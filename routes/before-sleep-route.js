const express = require('express');
const router = express.Router();


const {
    getallbeforesleepRoute
} = require('../services/before-sleep-azkar-service');

router.get('/', getallbeforesleepRoute);

module.exports = router;