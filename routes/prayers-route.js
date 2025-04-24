const express = require('express');
const router = express.Router();


const {
    getallprayers
} = require('../services/prayers-service');

router.get('/', getallprayers);

module.exports = router;