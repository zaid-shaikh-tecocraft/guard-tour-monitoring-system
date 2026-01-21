const prisma = require('../config/prisma');

async function list(req, res) {
    try {
        const patrolPoints = await prisma.patrolPoint.findMany({
            include: { organization: true },
            orderBy: { createdAt: 'desc' }
        });
        res.render('patrolPoints/list', { patrolPoints });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function showNew(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('patrolPoints/form', { patrolPoint: null, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function create(req, res) {
    try {
        await prisma.patrolPoint.create({
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                location: req.body.location || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/patrol-points');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('patrolPoints/form', { patrolPoint: null, organizations, error: error.message });
    }
}

async function edit(req, res) {
    try {
        const patrolPoint = await prisma.patrolPoint.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        if (!patrolPoint) {
            return res.redirect('/patrol-points');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('patrolPoints/form', { patrolPoint, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function update(req, res) {
    try {
        await prisma.patrolPoint.update({
            where: { id: parseInt(req.params.id) },
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                location: req.body.location || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/patrol-points');
    } catch (error) {
        const patrolPoint = await prisma.patrolPoint.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('patrolPoints/form', { patrolPoint, organizations, error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        await prisma.patrolPoint.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/patrol-points');
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
