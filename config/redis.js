const Redis = require('ioredis');
const { REDIS_URL } = require('./env');

const connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
});

module.exports = connection;
