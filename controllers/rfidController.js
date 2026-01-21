const prisma = require('../config/prisma');
const { removeSpecialChars } = require('../utils/rfidUtils');
const { rfidScanQueue } = require('../queues/rfidScanQueue');

async function handleRfidScan(req, res) {
    try {
        const rawUrl = req.originalUrl;
        const rawQuery = rawUrl.split('?')[1];

        if (!rawQuery) {
            return res.status(200).send('$RFID=0#');
        }

        const cleanData = rawQuery.replace(/^\$/, '').replace(/\*$/, '');
        const parts = cleanData.split(',');

        const firstFields = parts[0].split('&');

        const orgId = removeSpecialChars(firstFields[0]);
        const machineId = firstFields[1];

        const records = [];

        records.push({
            orgId,
            machineId,
            lrfid: firstFields[2],
            grfid: firstFields[3],
            dot: firstFields[4]
        });

        for (let i = 1; i < parts.length; i++) {
            const fields = parts[i].split('&');

            records.push({
                orgId,
                machineId,
                lrfid: fields[0],
                grfid: fields[1],
                dot: fields[2]
            });
        }

        await rfidScanQueue.add('process-scan', { records });

        return res.status(200).send('$RFID=0#');
    } catch (err) {
        console.error('RFID Scan Error:', err);
        return res.status(200).send('$RFID=0#');
    }
}

async function getRfidData(req, res) {
    try {
        const { date } = req.query;
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const skip = (page - 1) * limit;
        const where = {};

        if (date) {
            const start = new Date(`${date}T00:00:00.000Z`);
            const end = new Date(`${date}T23:59:59.999Z`);
            where.dateOfTransaction = { gte: start, lte: end };
        }

        const [total, records] = await Promise.all([
            prisma.rfidRecord.count({ where }),
            prisma.rfidRecord.findMany({
                where,
                orderBy: { dateOfTransaction: 'asc' },
                skip,
                take: limit
            })
        ]);

        return res.json({
            success: true,
            date: date || null,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
            data: records
        });
    } catch (err) {
        console.error('RFID Data Error:', err);
        return res.status(500).json({
            success: false,
            error: 'Failed to retrieve RFID data'
        });
    }
}

module.exports = {
    handleRfidScan,
    getRfidData
};
