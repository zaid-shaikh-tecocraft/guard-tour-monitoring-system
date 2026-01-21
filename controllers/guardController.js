const prisma = require('../config/prisma');

async function list(req, res) {
    try {
        const guards = await prisma.guard.findMany({
            include: { organization: true },
            orderBy: { createdAt: 'desc' }
        });
        res.render('guards/list', { guards });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function showNew(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('guards/form', { guard: null, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function create(req, res) {
    try {
        await prisma.guard.create({
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                employeeId: req.body.employeeId || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/guards');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('guards/form', { guard: null, organizations, error: error.message });
    }
}

async function edit(req, res) {
    try {
        const guard = await prisma.guard.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        if (!guard) {
            return res.redirect('/guards');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('guards/form', { guard, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function update(req, res) {
    try {
        await prisma.guard.update({
            where: { id: parseInt(req.params.id) },
            data: {
                rfid: req.body.rfid,
                name: req.body.name,
                employeeId: req.body.employeeId || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/guards');
    } catch (error) {
        const guard = await prisma.guard.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('guards/form', { guard, organizations, error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        await prisma.guard.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/guards');
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
