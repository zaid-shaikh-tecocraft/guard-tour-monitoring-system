const express = require('express');
const { handleRfidScan, getRfidData } = require('../controllers/rfidController');

const router = express.Router();

router.get('/rfid-scan', handleRfidScan);
router.get('/rfid-data', getRfidData);

module.exports = router;
