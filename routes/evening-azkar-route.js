const express = require('express');
const router = express.Router();


const {
    getalleveningazkarRoute
} = require('../services/evening-azkar-service');

router.get('/', getalleveningazkarRoute);

module.exports = router;