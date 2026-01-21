const prisma = require('../config/prisma');

async function list(req, res) {
    try {
        const attendancePoints = await prisma.attendancePoint.findMany({
            include: { organization: true },
            orderBy: { createdAt: 'desc' }
        });
        res.render('attendancePoints/list', { attendancePoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function showNew(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('attendancePoints/form', { attendancePoint: null, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function create(req, res) {
    try {
        await prisma.attendancePoint.create({
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                location: req.body.location || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/attendance-points');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('attendancePoints/form', { attendancePoint: null, organizations, error: error.message });
    }
}

async function edit(req, res) {
    try {
        const attendancePoint = await prisma.attendancePoint.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        if (!attendancePoint) {
            return res.redirect('/attendance-points');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('attendancePoints/form', { attendancePoint, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function update(req, res) {
    try {
        await prisma.attendancePoint.update({
            where: { id: parseInt(req.params.id) },
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                location: req.body.location || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/attendance-points');
    } catch (error) {
        const attendancePoint = await prisma.attendancePoint.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('attendancePoints/form', { attendancePoint, organizations, error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        await prisma.attendancePoint.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/attendance-points');
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

module.exports = {
    list,
    new: showNew,
    create,
    edit,
    update,
    delete: deleteItem
};
