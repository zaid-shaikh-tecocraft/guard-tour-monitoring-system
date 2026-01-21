const startRfidWorker = require('./rfidScanWorker');

function startWorkers() {
    // Register all workers here
    startRfidWorker();
}

module.exports = {
    startWorkers
};
