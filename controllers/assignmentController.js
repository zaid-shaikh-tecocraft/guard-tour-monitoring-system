const prisma = require('../config/prisma');

// Attendance Assignments
async function listAttendance(req, res) {
    try {
        const assignments = await prisma.guardAttendanceAssignment.findMany({
            include: {
                guard: true,
                attendancePoint: true,
                organization: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.render('assignments/attendanceList', { assignments });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function newAttendance(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const attendancePoints = await prisma.attendancePoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/attendanceForm', { assignment: null, organizations, guards, attendancePoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function createAttendance(req, res) {
    try {
        await prisma.guardAttendanceAssignment.create({
            data: {
                guardId: parseInt(req.body.guardId),
                attendancePointId: parseInt(req.body.attendancePointId),
                orgId: parseInt(req.body.orgId),
                isActive: req.body.isActive === 'on',
                startDate: req.body.startDate ? new Date(req.body.startDate) : null,
                endDate: req.body.endDate ? new Date(req.body.endDate) : null
            }
        });
        res.redirect('/attendance-assignments');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const attendancePoints = await prisma.attendancePoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/attendanceForm', { assignment: null, organizations, guards, attendancePoints, error: error.message });
    }
}

async function editAttendance(req, res) {
    try {
        const assignment = await prisma.guardAttendanceAssignment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                guard: true,
                attendancePoint: true,
                organization: true
            }
        });
        if (!assignment) {
            return res.redirect('/attendance-assignments');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const attendancePoints = await prisma.attendancePoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/attendanceForm', { assignment, organizations, guards, attendancePoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function updateAttendance(req, res) {
    try {
        await prisma.guardAttendanceAssignment.update({
            where: { id: parseInt(req.params.id) },
            data: {
                guardId: parseInt(req.body.guardId),
                attendancePointId: parseInt(req.body.attendancePointId),
                orgId: parseInt(req.body.orgId),
                isActive: req.body.isActive === 'on',
                startDate: req.body.startDate ? new Date(req.body.startDate) : null,
                endDate: req.body.endDate ? new Date(req.body.endDate) : null
            }
        });
        res.redirect('/attendance-assignments');
    } catch (error) {
        const assignment = await prisma.guardAttendanceAssignment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                guard: true,
                attendancePoint: true,
                organization: true
            }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const attendancePoints = await prisma.attendancePoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/attendanceForm', { assignment, organizations, guards, attendancePoints, error: error.message });
    }
}

async function deleteAttendance(req, res) {
    try {
        await prisma.guardAttendanceAssignment.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/attendance-assignments');
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

// Patrol Assignments
async function listPatrol(req, res) {
    try {
        const assignments = await prisma.guardPatrolAssignment.findMany({
            include: {
                guard: true,
                patrolPoint: true,
                organization: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.render('assignments/patrolList', { assignments });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function newPatrol(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const patrolPoints = await prisma.patrolPoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/patrolForm', { assignment: null, organizations, guards, patrolPoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function createPatrol(req, res) {
    try {
        await prisma.guardPatrolAssignment.create({
            data: {
                guardId: parseInt(req.body.guardId),
                patrolPointId: parseInt(req.body.patrolPointId),
                orgId: parseInt(req.body.orgId),
                isActive: req.body.isActive === 'on',
                startDate: req.body.startDate ? new Date(req.body.startDate) : null,
                endDate: req.body.endDate ? new Date(req.body.endDate) : null
            }
        });
        res.redirect('/patrol-assignments');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const patrolPoints = await prisma.patrolPoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/patrolForm', { assignment: null, organizations, guards, patrolPoints, error: error.message });
    }
}

async function editPatrol(req, res) {
    try {
        const assignment = await prisma.guardPatrolAssignment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                guard: true,
                patrolPoint: true,
                organization: true
            }
        });
        if (!assignment) {
            return res.redirect('/patrol-assignments');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const patrolPoints = await prisma.patrolPoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/patrolForm', { assignment, organizations, guards, patrolPoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function updatePatrol(req, res) {
    try {
        await prisma.guardPatrolAssignment.update({
            where: { id: parseInt(req.params.id) },
            data: {
                guardId: parseInt(req.body.guardId),
                patrolPointId: parseInt(req.body.patrolPointId),
                orgId: parseInt(req.body.orgId),
                isActive: req.body.isActive === 'on',
                startDate: req.body.startDate ? new Date(req.body.startDate) : null,
                endDate: req.body.endDate ? new Date(req.body.endDate) : null
            }
        });
        res.redirect('/patrol-assignments');
    } catch (error) {
        const assignment = await prisma.guardPatrolAssignment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                guard: true,
                patrolPoint: true,
                organization: true
            }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        const guards = await prisma.guard.findMany({
            orderBy: { name: 'asc' }
        });
        const patrolPoints = await prisma.patrolPoint.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('assignments/patrolForm', { assignment, organizations, guards, patrolPoints, error: error.message });
    }
}

async function deletePatrol(req, res) {
    try {
        await prisma.guardPatrolAssignment.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/patrol-assignments');
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

module.exports = {
    listAttendance,
    newAttendance,
    createAttendance,
    editAttendance,
    updateAttendance,
    deleteAttendance,
    listPatrol,
    newPatrol,
    createPatrol,
    editPatrol,
    updatePatrol,
    deletePatrol
};
