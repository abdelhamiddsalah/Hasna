const express = require('express');
const router = express.Router();


const {
    getallbathroomazkarRoute
} = require('../services/bathroom-azkar-service');

router.get('/', getallbathroomazkarRoute);

module.exports = router;