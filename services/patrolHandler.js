const prisma = require('../config/prisma');

async function handlePatrol(scanData, classification) {
    const { orgId, machineId, scannedAt } = scanData;
    const { guard, patrolPoint } = classification;

    // Convert orgId string to number
    const orgIdNum = parseInt(orgId, 10);

    // Find or get machine
    let machine = await prisma.machine.findUnique({
        where: { machineId }
    });

    // If machine doesn't exist, we might need to create it or handle error
    if (!machine) {
        throw new Error(`Machine with machineId ${machineId} not found`);
    }

    // Verify machine belongs to the organization
    if (machine.orgId !== orgIdNum) {
        throw new Error(`Machine ${machineId} does not belong to organization ${orgId}`);
    }

    // Check if guard is assigned to this patrol point
    const assignment = await prisma.guardPatrolAssignment.findFirst({
        where: {
            guardId: guard.id,
            patrolPointId: patrolPoint.id,
            orgId: orgIdNum,
            isActive: true,
            AND: [
                {
                    OR: [
                        { startDate: null },
                        { startDate: { lte: scannedAt } }
                    ]
                },
                {
                    OR: [
                        { endDate: null },
                        { endDate: { gte: scannedAt } }
                    ]
                }
            ]
        }
    });

    if (!assignment) {
        throw new Error(`Guard ${guard.name} (ID: ${guard.id}) is not assigned to patrol point ${patrolPoint.name} (ID: ${patrolPoint.id})`);
    }

    // Create patrol record
    const patrol = await prisma.patrol.create({
        data: {
            guardId: guard.id,
            patrolPointId: patrolPoint.id,
            machineId: machine.id,
            orgId: orgIdNum,
            scannedAt
        }
    });

    return patrol;
}

module.exports = {
    handlePatrol
};
