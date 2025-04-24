const express = require('express');
const router = express.Router();


const {
    getallafterprayazkar
} = require('../services/after-pray-azkar-service');

router.get('/', getallafterprayazkar);

module.exports = router;