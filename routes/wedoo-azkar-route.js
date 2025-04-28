const express = require('express');
const router = express.Router();


const {
    getallwedooazkarRoute
} = require('../services/wedoo-azkar-service');

router.get('/', getallwedooazkarRoute);

module.exports = router;