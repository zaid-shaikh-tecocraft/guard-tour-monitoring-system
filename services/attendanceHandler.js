const prisma = require('../config/prisma');

async function handleAttendance(scanData, classification) {
    const { orgId, machineId, scannedAt } = scanData;
    const { guard, attendancePoint } = classification;

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
    if (!machine) {
        throw new Error(`Machine with machineId ${machineId} not found`);
    }

    // Verify machine belongs to the organization
    if (machine.orgId !== orgIdNum) {
        throw new Error(`Machine ${machineId} does not belong to organization ${orgId}`);
    }

    // Check if guard is assigned to this attendance point
    const assignment = await prisma.guardAttendanceAssignment.findFirst({
        where: {
            guardId: guard.id,
            attendancePointId: attendancePoint.id,
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
        throw new Error(`Guard ${guard.name} (ID: ${guard.id}) is not assigned to attendance point ${attendancePoint.name} (ID: ${attendancePoint.id})`);
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
        data: {
            guardId: guard.id,
            attendancePointId: attendancePoint.id,
            machineId: machine.id,
            orgId: orgIdNum,
            scannedAt
        }
    });

    return attendance;
}

module.exports = {
    handleAttendance
};
