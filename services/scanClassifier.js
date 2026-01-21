const prisma = require('../config/prisma');

const SCAN_TYPES = {
    AUTHENTICATION: 'authentication',
    ATTENDANCE: 'attendance',
    PATROL: 'patrol',
    UNKNOWN: 'unknown'
};

async function classifyScan(orgId, lrfid, grfid) {
    try {
        // Convert orgId string to number if needed
        const orgIdNum = parseInt(orgId, 10);
        if (isNaN(orgIdNum)) {
            return { type: SCAN_TYPES.UNKNOWN, reason: 'Invalid orgId' };
        }

        // Look up guard by grfid and orgId
        const guard = await prisma.guard.findFirst({
            where: {
                rfid: grfid,
                orgId: orgIdNum
            }
        });

        if (!guard) {
            return { type: SCAN_TYPES.UNKNOWN, reason: 'Guard not found' };
        }

        // If lrfid is empty or not provided, it's authentication
        if (!lrfid || lrfid.trim() === '') {
            return {
                type: SCAN_TYPES.AUTHENTICATION,
                guard,
                reason: 'No location RFID provided'
            };
        }

        // Check if lrfid matches an attendance point
        const attendancePoint = await prisma.attendancePoint.findFirst({
            where: {
                rfid: lrfid,
                orgId: orgIdNum
            }
        });

        if (attendancePoint) {
            return {
                type: SCAN_TYPES.ATTENDANCE,
                guard,
                attendancePoint,
                reason: 'Location RFID matches attendance point'
            };
        }

        // Check if lrfid matches a patrol point
        const patrolPoint = await prisma.patrolPoint.findFirst({
            where: {
                rfid: lrfid,
                orgId: orgIdNum
            }
        });

        if (patrolPoint) {
            return {
                type: SCAN_TYPES.PATROL,
                guard,
                patrolPoint,
                reason: 'Location RFID matches patrol point'
            };
        }

        // Guard found but location RFID doesn't match any point - still authentication
        return {
            type: SCAN_TYPES.AUTHENTICATION,
            guard,
            reason: 'Location RFID not found in any point table'
        };
    } catch (error) {
        console.error('Error classifying scan:', error);
        return {
            type: SCAN_TYPES.UNKNOWN,
            reason: `Classification error: ${error.message}`
        };
    }
}

module.exports = {
    classifyScan,
    SCAN_TYPES
};
