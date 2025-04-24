const express = require('express');
const router = express.Router();


const {
    getallprayersRoute
} = require('../services/prayers-service');

router.get('/', getallprayersRoute);

module.exports = router;