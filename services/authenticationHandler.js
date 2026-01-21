const prisma = require('../config/prisma');

async function handleAuthentication(scanData, classification) {
    const { orgId, machineId, scannedAt } = scanData;
    const { guard } = classification;

    // Convert orgId string to number
    const orgIdNum = parseInt(orgId, 10);

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
