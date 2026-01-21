const { Queue } = require('bullmq');
const connection = require('../config/redis');

const QUEUE_NAME = 'rfid-scan';

const rfidScanQueue = new Queue(QUEUE_NAME, { connection });

module.exports = {
    QUEUE_NAME,
    rfidScanQueue
};
