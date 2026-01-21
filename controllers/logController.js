const prisma = require('../config/prisma');

async function listAttendance(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
        const skip = (page - 1) * limit;

        const where = {};
        if (req.query.orgId) {
            where.orgId = parseInt(req.query.orgId);
        }
        if (req.query.guardId) {
            where.guardId = parseInt(req.query.guardId);
        }
        if (req.query.attendancePointId) {
            where.attendancePointId = parseInt(req.query.attendancePointId);
        }
        if (req.query.date) {
            const start = new Date(`${req.query.date}T00:00:00.000Z`);
            const end = new Date(`${req.query.date}T23:59:59.999Z`);
            where.scannedAt = {
                gte: start,
                lte: end
            };
        }

        const [total, attendances] = await Promise.all([
            prisma.attendance.count({ where }),
            prisma.attendance.findMany({
                where,
                include: {
                    guard: true,
                    attendancePoint: true,
                    machine: true,
                    organization: true
                },
                orderBy: { scannedAt: 'desc' },
                skip,
                take: limit
            })
        ]);

        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const attendancePoints = await prisma.attendancePoint.findMany({
            orderBy: { name: 'asc' }
        });

        res.render('logs/attendance', {
            attendances,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            organizations,
            guards,
            attendancePoints,
            filters: {
                orgId: req.query.orgId || '',
                guardId: req.query.guardId || '',
                attendancePointId: req.query.attendancePointId || '',
                date: req.query.date || ''
            }
        });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function listPatrol(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
        const skip = (page - 1) * limit;

        const where = {};
        if (req.query.orgId) {
            where.orgId = parseInt(req.query.orgId);
        }
        if (req.query.guardId) {
            where.guardId = parseInt(req.query.guardId);
        }
        if (req.query.patrolPointId) {
            where.patrolPointId = parseInt(req.query.patrolPointId);
        }
        if (req.query.date) {
            const start = new Date(`${req.query.date}T00:00:00.000Z`);
            const end = new Date(`${req.query.date}T23:59:59.999Z`);
            where.scannedAt = {
                gte: start,
                lte: end
            };
        }

        const [total, patrols] = await Promise.all([
            prisma.patrol.count({ where }),
            prisma.patrol.findMany({
                where,
                include: {
                    guard: true,
                    patrolPoint: true,
                    machine: true,
                    organization: true
                },
                orderBy: { scannedAt: 'desc' },
                skip,
                take: limit
            })
        ]);

        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const patrolPoints = await prisma.patrolPoint.findMany({
            orderBy: { name: 'asc' }
        });

        res.render('logs/patrol', {
            patrols,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
            organizations,
            guards,
            patrolPoints,
            filters: {
                orgId: req.query.orgId || '',
                guardId: req.query.guardId || '',
                patrolPointId: req.query.patrolPointId || '',
                date: req.query.date || ''
            }
        });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

module.exports = {
    listAttendance,
    listPatrol
};
