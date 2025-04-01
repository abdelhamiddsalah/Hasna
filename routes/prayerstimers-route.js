const express = require("express");
const router = express.Router();
const { getallprayerstimersRoute } = require("../services/prayerstimers-service");

router.get("/prayerstimers", getallprayerstimersRoute); // ✅ هذا المسار يصبح "/api/v1/prayerstimers"

module.exports = router;
