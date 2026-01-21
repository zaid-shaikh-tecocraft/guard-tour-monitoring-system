const prisma = require('../config/prisma');

async function list(req, res) {
    try {
        const organizations = await prisma.organization.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.render('organizations/list', { organizations });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function showNew(req, res) {
    res.render('organizations/form', { organization: null });
}

async function create(req, res) {
    try {
        await prisma.organization.create({
            data: {
                name: req.body.name
            }
        });
        res.redirect('/organizations');
    } catch (error) {
        res.render('organizations/form', { organization: null, error: error.message });
    }
}

async function edit(req, res) {
    try {
        const organization = await prisma.organization.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!organization) {
            return res.redirect('/organizations');
        }
        res.render('organizations/form', { organization });
    } catch (error) {
        res.render('error', { error: error.message });
    }
}

async function update(req, res) {
    try {
        await prisma.organization.update({
            where: { id: parseInt(req.params.id) },
            data: {
                name: req.body.name
            }
        });
        res.redirect('/organizations');
    } catch (error) {
        const organization = await prisma.organization.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        res.render('organizations/form', { organization, error: error.message });
    }
}

async function deleteItem(req, res) {
    try {
        await prisma.organization.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.redirect('/organizations');
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
