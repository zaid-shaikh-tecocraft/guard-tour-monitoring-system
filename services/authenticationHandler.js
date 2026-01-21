const prisma = require('../config/prisma');

async function handleAuthentication(scanData, classification) {
    const { orgId, machineId, scannedAt } = scanData;
    const { guard } = classification;

    // Look up organization by custom orgId (string)
    const organization = await prisma.organization.findUnique({
        where: { orgId: orgId }
    });

    if (!organization) {
        throw new Error(`Organization with orgId ${orgId} not found`);
    }

    const orgIdNum = organization.id;

    // Find or get machine
    let machine = await prisma.machine.findUnique({
        where: { machineId }
    });

    // If machine doesn't exist, we might need to create it or handle error
    // For now, we'll require machine to exist
    if (!machine) {
        throw new Error(`Machine with machineId ${machineId} not found`);
    }

    // Verify machine belongs to the organization
    if (machine.orgId !== orgIdNum) {
        throw new Error(`Machine ${machineId} does not belong to organization ${orgId}`);
    }

    // Create authentication record
    const authentication = await prisma.authentication.create({
        data: {
            guardId: guard.id,
            machineId: machine.id,
            orgId: orgIdNum,
            scannedAt
        }
    });

    return authentication;
}

module.exports = {
    handleAuthentication
};
