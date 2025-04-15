const express = require('express');
const router = express.Router();


const {
    getallmorningazkarRoute
} = require('../services/morning-azkar-service');

router.get('/morningazkar', getallmorningazkarRoute);

module.exports = router;