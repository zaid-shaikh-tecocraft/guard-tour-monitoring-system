const { Worker } = require('bullmq');
const connection = require('../config/redis');
const prisma = require('../config/prisma');
const { parseDOT } = require('../utils/rfidUtils');
const { QUEUE_NAME } = require('../queues/rfidScanQueue');
const { classifyScan, SCAN_TYPES } = require('../services/scanClassifier');
const { handleAuthentication } = require('../services/authenticationHandler');
const { handleAttendance } = require('../services/attendanceHandler');
const { handlePatrol } = require('../services/patrolHandler');

function startRfidWorker() {
    const worker = new Worker(
        QUEUE_NAME,
        async job => {
            const { records } = job.data;

            for (const record of records) {
                try {
                    const scannedAt = parseDOT(record.dot) || new Date();

                    // Classify the scan
                    const classification = await classifyScan(
                        record.orgId,
                        record.lrfid,
                        record.grfid
                    );

                    // Prepare scan data
                    const scanData = {
                        orgId: record.orgId,
                        machineId: record.machineId,
                        scannedAt
                    };

                    // Route to appropriate handler based on scan type
                    switch (classification.type) {
                        case SCAN_TYPES.AUTHENTICATION:
                            await handleAuthentication(scanData, classification);
                            console.log(`[${QUEUE_NAME}] Authentication processed for guard ${classification.guard.id}`);
                            break;

                        case SCAN_TYPES.ATTENDANCE:
                            await handleAttendance(scanData, classification);
                            console.log(`[${QUEUE_NAME}] Attendance processed for guard ${classification.guard.id} at point ${classification.attendancePoint.id}`);
                            break;

                        case SCAN_TYPES.PATROL:
                            await handlePatrol(scanData, classification);
                            console.log(`[${QUEUE_NAME}] Patrol processed for guard ${classification.guard.id} at point ${classification.patrolPoint.id}`);
                            break;

                        case SCAN_TYPES.UNKNOWN:
                        default:
                            console.warn(`[${QUEUE_NAME}] Unknown scan type: ${classification.reason}`, {
                                orgId: record.orgId,
                                machineId: record.machineId,
                                lrfid: record.lrfid,
                                grfid: record.grfid
                            });
                            // Log unknown scans to RfidRecord for manual review
                            await prisma.rfidRecord.create({
                                data: {
                                    orgId: record.orgId,
                                    machineId: record.machineId,
                                    lrfid: record.lrfid,
                                    grfid: record.grfid,
                                    dot: record.dot,
                                    dateOfTransaction: scannedAt
                                }
                            });
                            break;
                    }
                } catch (error) {
                    console.error(`[${QUEUE_NAME}] Error processing record:`, error.message, {
                        orgId: record.orgId,
                        machineId: record.machineId,
                        lrfid: record.lrfid,
                        grfid: record.grfid
                    });

                    // Log failed scans to RfidRecord for manual review
                    try {
                        await prisma.rfidRecord.create({
                            data: {
                                orgId: record.orgId,
                                machineId: record.machineId,
                                lrfid: record.lrfid,
                                grfid: record.grfid,
                                dot: record.dot,
                                dateOfTransaction: parseDOT(record.dot)
                            }
                        });
                    } catch (logError) {
                        console.error(`[${QUEUE_NAME}] Failed to log error record:`, logError.message);
                    }
                }
            }
        },
        {
            connection,
            concurrency: 5
        }
    );

    worker.on('completed', job => {
        console.log(`[${QUEUE_NAME}] Job ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
        console.error(`[${QUEUE_NAME}] Job ${job?.id || 'unknown'} failed:`, err.message);
    });

    return worker;
}

module.exports = startRfidWorker;
