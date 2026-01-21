const prisma = require('../config/prisma');

async function list(req, res) {
    try {
        const machines = await prisma.machine.findMany({
            include: { organization: true },
            orderBy: { createdAt: 'desc' }
        });
        res.render('machines/list', { machines });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function showNew(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('machines/form', { machine: null, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function create(req, res) {
    try {
        await prisma.machine.create({
            data: {
                machineId: req.body.machineId,
                name: req.body.name || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/machines');
    } catch (error) {
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('machines/form', { machine: null, organizations, error: error.message });
    }
}

async function edit(req, res) {
    try {
        const machine = await prisma.machine.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        if (!machine) {
            return res.redirect('/machines');
        }
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('machines/form', { machine, organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function update(req, res) {
    try {
        await prisma.machine.update({
            where: { id: parseInt(req.params.id) },
            data: {
                machineId: req.body.machineId,
                name: req.body.name || null,
                orgId: parseInt(req.body.orgId)
            }
        });
        res.redirect('/machines');
    } catch (error) {
        const machine = await prisma.machine.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { organization: true }
        });
        const organizations = await prisma.organization.findMany({
            orderBy: { name: 'asc' }
        });
        res.render('machines/form', { machine, organizations, error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        await prisma.machine.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/machines');
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
